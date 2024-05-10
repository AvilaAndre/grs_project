use std::{
    io::{BufRead, BufReader},
    process::{Command, Stdio},
};

use tauri::AppHandle;

use crate::{docker::dockerstats::DockerStats, state::ServiceAccess};

pub fn watch_containers(app_handle: AppHandle) {
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
