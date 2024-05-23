// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod docker;
mod instances;
mod manager;
mod state;
mod utils;

use std::collections::HashMap;

use std::collections::VecDeque;

use config::network_data::NetworkData;
use config::ComposeConfig;
use docker::dockerstats::DockerStats;
use docker::watcher::{watch_containers_connections, watch_containers_stats};
use instances::nginx::NginxInstance;
use instances::router::RouterInstance;
use instances::types::NetworkData as NetworkInfo;
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
			

			let _ = app_handle.manager_mut(|man| {
				man.add_network_to_config(
					name.to_string(),
					name.to_string()+"_dns_net",
					NetworkData { subnet: "192.168.0.0/29".to_string(), gateway: "192.168.0.1".to_string(), dns_endpoint: Some("192.168.0.3".to_string())},
					&app_handle,
				)
			});
			
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
    network_name: String,
    network_address: String,
    replicas: u8,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::NodeApp(NodeAppInstance {
                network_address,
                network_name,
                replicas: if replicas <= 1 { 1 } else { replicas },
            }),
            &app_handle,
        )
    })
}

#[tauri::command]
fn add_client_instance_to_config(
    config_name: String,
    instance_name: String,
    network_address: String,
    network_name: String,
    replicas: u8,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::Client(ClientInstance {
                network_address,
                network_name,
                replicas: if replicas <= 1 { 1 } else { replicas },
            }),
            &app_handle,
        )
    })
}
/**
 * invalid args `networkAddress` for command `add_nginx_instance_to_config`:
 * command add_nginx_instance_to_config missing required key networkAddress
 */
#[tauri::command]
fn add_nginx_instance_to_config(
    config_name: String,
    instance_name: String,
    memory_limit: String,
    cpus_limit: String,
    memory_reservations: String,
    network_address: String,
    network_name: String,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::Nginx(NginxInstance {
                network_address,
                network_name,
                memory_limit,
                cpus_limit,
                memory_reservations,
            }),
            &app_handle,
        )
    })
}

// Para criar uma instancia basta uma rede nos argumentos, depois é transformado em vetor
#[tauri::command]
fn add_router_instance_to_config(
    config_name: String,
    instance_name: String,
    network_address: String,
    network_name: String,
    app_handle: AppHandle,
) -> Result<bool, String> {
    let net_data = NetworkInfo {
        network_name,
        ipv4_address: network_address,
    };

    app_handle.manager_mut(|man| {
        man.add_instance_to_config(
            config_name,
            instance_name,
            Instance::Router(RouterInstance {
                networks: vec![net_data],
            }),
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
	dns_endpoint: String,
    app_handle: AppHandle,
) -> Result<bool, String> {
    app_handle.manager_mut(|man| {

		let dns_end;
		if dns_endpoint != "" {
			dns_end = Some(dns_endpoint.clone());
		} else {
			dns_end = None;
		}

		println!("\ndns_endpoint: {}\n", dns_endpoint);

        man.add_network_to_config(
            config_name,
            network_name,
            NetworkData { subnet, gateway, dns_endpoint: dns_end },
            &app_handle,
        )
    })
}

// TODO javascript disto
// TODO function "add_entry_to_dns". argumentos -> IP + name que queremos que fique (igual ao container se nao for especificado).
// perguntar ao user aquando a criação de uma instancia se quer adicionar ao DNS, só quando o IP esta corretamente preenchido.
// escreve no .local/share/com.netking.dev/dns.conf-name.net se checkbox for preenchida
// dns.{conf-name}.net + {conf-name}.conf.local
// criar NETWORK só do DNS, chamar 'add_network_to_config' após criação da config, associar logo o DNS 192.168.0.0/30 , IP 192.168.0.2. feito em src-tauri/src/main.rs line 40
#[tauri::command]
fn add_entry_to_dns_bind(config_name: String, dns_name: String, ip_address: String, app_handle: AppHandle) -> Result<bool, String>{
	app_handle.manager_mut(|man| {
        man.add_entry_to_dns_bind(
            config_name,
            dns_name,
            ip_address,
			&app_handle
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

#[tauri::command]
async fn start_config_docker(config_name: String, app_handle: AppHandle) -> Result<(), String> {
    app_handle.manager_mut(|man| man.start_config_docker(config_name, &app_handle))
}

#[tauri::command]
async fn stop_config_docker(config_name: String, app_handle: AppHandle) -> Result<(), String> {
    app_handle.manager_mut(|man| man.stop_config_docker(config_name, &app_handle))
}

#[tauri::command]
async fn get_container_stats(
    instance_name: String,
    app_handle: AppHandle,
) -> Result<Vec<VecDeque<DockerStats>>, String> {
    app_handle.manager(|man| man.get_instance_docker_stats(instance_name))
}

#[tauri::command]
async fn get_container_connections(app_handle: AppHandle) -> Vec<(String, String)> {
    app_handle.manager(|man| man.get_container_connections())
}

#[tauri::command]
async fn get_existing_networks(
    config_name: String,
    app_handle: AppHandle,
) -> Result<HashMap<String, NetworkData>, String> {
    app_handle.manager_mut(|man| man.get_existing_networks(config_name))
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
            get_instances,
            start_config_docker,
            stop_config_docker,
            get_container_stats,
            get_container_connections,
            get_existing_networks,
			add_entry_to_dns_bind,
        ])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let manager = ConfigManager::initialize(&handle)
                .expect("ConfigManager initialize should succeed");
            *app_state.manager.lock().unwrap() = Some(manager);

            let handle2 = app.app_handle();

            std::thread::spawn(|| watch_containers_stats(handle));
            std::thread::spawn(|| watch_containers_connections(handle2));

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
