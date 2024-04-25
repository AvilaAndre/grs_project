// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod manager;
mod state;

use config::ComposeConfig;
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
    app_handle.manager(|man| man.get_configs_list())
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            manager: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            create_compose_config,
            get_configs
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
