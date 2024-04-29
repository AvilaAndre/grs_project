use serde::Deserialize;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::Write;
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

        let instance = Self {
            name,
            node_apps: HashMap::new(),
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

        // write name
        let _ = f.write(format!("name = \"{}\"\n\n", self.name).as_bytes());

        // write node apps
        for instance in &self.node_apps {
            // header
            let _ = f.write(format!("[node_apps.\"{}\"]\n", instance.0).as_bytes());

            // networks
            let _ = f.write("networks = [".as_bytes());
            let mut first: bool = true;
            for network in &instance.1.networks {
                if first {
                    first = false;
                } else {
                    let _ = f.write(", ".as_bytes());
                }
                let _ = f.write(format!("\"{}\"", network).as_bytes());
            }
            let _ = f.write("]\n".as_bytes());

            // port
            let _ = f.write(format!("port = {}\n", instance.1.port).as_bytes());

            // replicas
            if instance.1.replicas.is_some() {
                let _ =
                    f.write(format!("replicas = {}\n", instance.1.replicas.unwrap()).as_bytes());
            }
        }

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
