use std::fs;
use std::process::Command;
use tauri::AppHandle;

use crate::state::ServiceAccess;

pub struct ComposeConfig {
    name: String,
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

        Ok(Self { name })
    }

    /**
     * Reads toml file an creates a ComposeConfig
     */
    pub fn from_file(name: String, app_handle: AppHandle) -> Result<Self, &'static str> {
        Ok(Self { name })
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
