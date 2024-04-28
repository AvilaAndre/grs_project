use serde::Deserialize;
use std::collections::HashMap;
use std::fs;
use std::process::Command;
use tauri::AppHandle;

use crate::instances::nodeapp::NodeAppInstance;
use crate::state::ServiceAccess;

#[derive(Debug, Deserialize)]
pub struct ComposeConfig {
    pub name: String,
    pub node_apps: HashMap<String, NodeAppInstance>,
}

impl ComposeConfig {
    pub fn new(name: String, app_handle: &AppHandle) -> Result<Self, &'static str> {
        let app_dir = app_handle
            .path_resolver()
            .app_data_dir()
            .expect("The app data directory should exist.");

        app_handle.manager_mut(|man| man.fetch_configs(app_handle));

        if app_handle.manager(|man| man.configs.get(&name).is_some()) {
            return Err("Config already exists");
        }

        let _file = fs::File::create(app_dir.join(name.clone() + ".toml"));

        // TODO: Write something to the file

        Ok(Self {
            name,
            node_apps: HashMap::new(),
        })
    }

    /**
     * Reads toml file an creates a ComposeConfig
     */
    pub fn from_file(name: String, app_handle: AppHandle) -> Result<Self, &'static str> {
        let app_dir = app_handle
            .path_resolver()
            .app_data_dir()
            .expect("The app data directory should exist.");

        let filepath = app_dir.join(name.clone() + ".toml");

        let contents = match fs::read_to_string(filepath.clone()) {
            Ok(c) => c,
            Err(_) => return Err("Could not read file"),
        };

        let config: ComposeConfig = match toml::from_str(&contents) {
            Ok(c) => c,
            Err(why) => {
                println!("why {}", why);
                return Err("Unable to load data");
            }
        };

        Ok(config)
    }

    pub fn up(&self) -> bool {
        let output = Command::new("docker")
            .arg("compose")
            .arg("-f")
            .arg(self.name.clone() + ".yml")
            .arg("up")
            .arg("-d")
            .output();

        match output {
            Ok(success) => {
                println!("output {:?}", success);
                return true;
            }
            Err(why) => {
                println!("Failed to launch docker compose file, reason: {:?}", why);
            }
        }

        true
    }
}
