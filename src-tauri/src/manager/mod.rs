use crate::config::ComposeConfig;
use std::{collections::HashMap, fs};
use tauri::AppHandle;

pub struct ConfigManager {
    pub configs: HashMap<String, ComposeConfig>,
}

impl ConfigManager {
    pub fn initialize(app_handle: &AppHandle) -> Result<Self, &'static str> {
        let mut instance = Self {
            configs: HashMap::new(),
        };

        instance.fetch_configs(app_handle);

        Ok(instance)
    }

    pub fn fetch_configs(&mut self, app_handle: &AppHandle) {
        let app_dir = app_handle
            .path_resolver()
            .app_data_dir()
            .expect("The app data directory should exist.");

        fs::create_dir_all(&app_dir).expect("The app data directory should be created.");

        // Search for configs
        let mut configs: HashMap<String, ComposeConfig> = HashMap::new();

        let paths = fs::read_dir(&app_dir).unwrap();

        for path in paths {
            match path {
                Ok(entry) => match entry.file_name().into_string() {
                    Ok(filename) => {
                        if filename.len() > 5
                            && &filename[filename.len() - 5..filename.len()] == ".toml"
                        {
                            let name: String = filename[0..filename.len() - 5].to_string();
                            let compose_config =
                                ComposeConfig::from_file(name.clone(), app_handle.clone());
                            if compose_config.is_ok() {
                                configs.insert(name, compose_config.unwrap());
                            }
                        }
                    }
                    Err(_) => {}
                },
                Err(why) => {
                    println!("Failed to read path. Reason: {}", why);
                }
            }
        }
        self.configs = configs;
    }

    pub fn get_configs_list(&self) -> Vec<String> {
        Vec::from_iter(self.configs.keys())
            .into_iter()
            .map(|borrowed_val| borrowed_val.clone())
            .collect()
    }
}
