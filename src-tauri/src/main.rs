// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod instances;
mod manager;
mod state;
mod utils;

use config::network_data::NetworkData;
use config::ComposeConfig;
use instances::nginx::NginxInstance;
use instances::router::RouterInstance;
use instances::Instance;
use instances::{client::ClientInstance, nodeapp::NodeAppInstance};
use manager::ConfigManager;
use state::{AppState, ServiceAccess};
use tauri::{AppHandle, Manager, State};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn create_compose_config(name: &str, app_handle: AppHandle) -> Result<Vec<String>, &'static str> {
    match ComposeConfig::new(name.to_string(), &app_handle) {
        Ok(new_config) => {
            app_handle.manager_mut(|man| man.configs.insert(name.to_string(), new_config));
            return Ok(app_handle.manager(|man| man.get_configs_list()));
        }
        Err(why) => return Err(why),
    }
}

#[tauri::command]
fn get_configs(app_handle: AppHandle) -> Vec<String> {
    app_handle.manager_mut(|man| man.fetch_configs(&app_handle));
    app_handle.manager(|man| man.get_configs_list())
}

#[tauri::command]
fn add_nodeapp_instance_to_config(
    config_name: String,
    instance_name: String,
    networks: Vec<String>,
    port: u16,
    replicas: u8,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::NodeApp(NodeAppInstance {
                networks,
                port,
                replicas: if replicas <= 1 { None } else { Some(replicas) },
            }),
            &app_handle,
        )
    })
}

#[tauri::command]
fn add_client_instance_to_config(
    config_name: String,
    instance_name: String,
    replicas: u8,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::Client(ClientInstance {
                network_address: String::new(),
                replicas: if replicas <= 1 { None } else { Some(replicas) },
            }),
            &app_handle,
        )
    })
}

#[tauri::command]
fn add_nginx_instance_to_config(
    config_name: String,
    instance_name: String,
    memory_limit: String,
    cpus_limit: String,
    memory_reservations: String,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::Nginx(NginxInstance {
                network_address: String::new(),
                memory_limit,
                cpus_limit,
                memory_reservations,
            }),
            &app_handle,
        )
    })
}

#[tauri::command]
fn add_router_instance_to_config(
    config_name: String,
    instance_name: String,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::Router(RouterInstance { networks: vec![] }),
            &app_handle,
        )
    })
}

#[tauri::command]
fn add_network_to_config(
    config_name: String,
    network_name: String,
    subnet: String,
    gateway: String,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_network_to_config(
            config_name,
            network_name,
            NetworkData { subnet, gateway },
            &app_handle,
        )
    })
}

#[tauri::command]
fn get_instances(
    config_name: String,
    app_handle: AppHandle,
) -> Result<Vec<(String, Instance)>, String> {
    app_handle.manager_mut(|man| man.get_instances_list(config_name))
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            manager: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            create_compose_config,
            get_configs,
            add_nodeapp_instance_to_config,
            add_client_instance_to_config,
            add_nginx_instance_to_config,
            add_router_instance_to_config,
            add_network_to_config,
            get_instances
        ])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let manager = ConfigManager::initialize(&handle)
                .expect("ConfigManager initialize should succeed");
            *app_state.manager.lock().unwrap() = Some(manager);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
