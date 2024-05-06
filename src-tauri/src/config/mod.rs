pub mod network_data;
pub mod docker;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::Write;
use std::process::Command;
use tauri::AppHandle;

use crate::instances::client::ClientInstance;
use crate::instances::nginx::NginxInstance;
use crate::instances::nodeapp::NodeAppInstance;
use crate::instances::router::RouterInstance;
use crate::state::ServiceAccess;

use self::network_data::NetworkData;

#[derive(Debug, Serialize, Deserialize)]
pub struct ComposeConfig {
    pub name: String,
    pub node_apps: Option<HashMap<String, NodeAppInstance>>,
    pub clients: Option<HashMap<String, ClientInstance>>,
    pub nginxs: Option<HashMap<String, NginxInstance>>,
    pub routers: Option<HashMap<String, RouterInstance>>,
    pub networks: Option<HashMap<String, NetworkData>>,
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

        let instance = Self {
            name,
            node_apps: None,
            clients: None,
            nginxs: None,
            routers: None,
            networks: None,
        };

        let _ = instance.write(app_handle);

        Ok(instance)
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

    pub fn write(&self, app_handle: &AppHandle) -> Result<bool, &str> {
        let app_dir = app_handle
            .path_resolver()
            .app_data_dir()
            .expect("The app data directory should exist.");

        let mut f = match File::create(app_dir.join(self.name.clone() + ".toml")) {
            Ok(f) => f,
            Err(_) => return Err("Couldn't create file to write"),
        };

        match toml::to_string(self) {
            Ok(text) => {
                if f.write(text.as_bytes()).is_err() {
                    return Err("Failed to write to file");
                };
            }
            Err(_) => return Err("Failed to transform config to TOML"),
        }


		// -------------------- Matilde ----------------------

        let dock_file = match File::create(app_dir.join(self.name.clone()+".yml")) {
            Ok(f) => f,
            Err(_) => return Err("Couldn't create file to write"),
        };

		let _ = docker::write_docker_compose(&dock_file, self);

		// ---------------------------------------------------

        Ok(true)
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
