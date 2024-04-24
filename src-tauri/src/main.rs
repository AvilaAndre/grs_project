// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;

use std::fs;
use tauri::AppHandle;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str, app_handle: AppHandle) -> String {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");

    let docker_compose_file = app_dir.join("docker-compose.yml");

    println!("path {:?}", docker_compose_file);

    let output = Command::new("docker")
        .arg("compose")
        .arg("-f")
        .arg(docker_compose_file)
        .arg("up")
        .arg("-d")
        .output();

    println!("output {:?}", output);

    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
