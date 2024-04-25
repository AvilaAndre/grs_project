use crate::config::ComposeConfig;
use std::{collections::HashMap, fs};
use tauri::AppHandle;

pub struct ConfigManager {
    pub configs: HashMap<String, ComposeConfig>,
}

impl ConfigManager {
    pub fn initialize(app_handle: &AppHandle) -> Result<Self, &'static str> {
        let app_dir = app_handle
            .path_resolver()
            .app_data_dir()
            .expect("The app data directory should exist.");

        fs::create_dir_all(&app_dir).expect("The app data directory should be created.");

        // Search for configs
        let mut configs: HashMap<String, ComposeConfig> = HashMap::new();

        // TODO: Search for configs
        let paths = fs::read_dir(&app_dir).unwrap();

        for path in paths {
            println!("path {:?}", path);

            match path {
                Ok(entry) => {
                    match entry.file_name().into_string() {
                        Ok(filename) => {
                            // TODO: Replace ".yml" with own config type
                            if &filename[filename.len() - 4..filename.len()] == ".yml" {
                                let name: String = filename[0..filename.len() - 4].to_string();
                                let compose_config =
                                    ComposeConfig::new(name.clone(), app_handle.clone());
                                if compose_config.is_ok() {
                                    configs.insert(name, compose_config.unwrap());
                                }
                            }
                        }
                        Err(_) => {}
                    }
                }
                Err(why) => {
                    println!("Failed to read path. Reason: {}", why);
                }
            }
        }

        Ok(Self { configs })
    }
}
