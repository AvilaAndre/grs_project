use std::{
    io::{BufRead, BufReader},
    process::{Command, Stdio},
};

use tauri::AppHandle;

use crate::{docker::dockerstats::DockerStats, state::ServiceAccess};

pub fn watch_containers_stats(app_handle: AppHandle) {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    let mut selected_config: Option<String>;

    loop {
        selected_config = app_handle.manager(|man| man.selected_config.clone());

        if selected_config.is_some() {
            let name = selected_config.unwrap();

            let cmd = Command::new("docker")
                .current_dir(app_dir.clone())
                .arg("compose")
                .arg("-f")
                .arg(name.clone() + ".yml")
                .arg("stats")
                .arg("--format")
                .arg("json")
                .stdout(Stdio::piped())
                .spawn()
                .expect("Failed to execute command");

            let stdout = cmd.stdout.unwrap();
            let stdout_reader = BufReader::new(stdout);
            let stdout_lines = stdout_reader.lines();

            for line in stdout_lines {
                if Some(name.clone()) != app_handle.manager(|man| man.selected_config.clone()) {
                    break;
                }
                let line = line.unwrap_or("".to_string());

                match serde_json::from_str::<DockerStats>(&line) {
                    Ok(stats) => app_handle.manager_mut(|man| man.add_new_docker_stats(stats)),
                    Err(_) => {} // continue
                }
            }
        }
    }
}

pub fn watch_containers_connections(app_handle: AppHandle) {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");

    let mut selected_config: Option<String>;

    loop {
        selected_config = app_handle.manager(|man| man.selected_config.clone());

        let mut connections: Vec<(String, String)> = vec![];

        if selected_config.is_some() {
            for source in app_handle.manager(|man| man.stats_recorded.clone()).keys() {
                for destination in app_handle.manager(|man| man.stats_recorded.clone()).keys() {
                    if source == destination {
                        continue;
                    }

                    let ping = Command::new("docker")
                        .current_dir(app_dir.clone())
                        .arg("exec")
                        .arg(source)
                        .arg("ping")
                        .arg("-c")
                        .arg("1")
                        .arg(destination)
                        .output()
                        .expect("Failed to execute command");

                    if ping.status.success() {
                        connections.push((source.to_string(), destination.to_string()));
                    }
                }
            }

            app_handle.manager_mut(|man| man.set_container_connections(connections));
        }
    }
}
