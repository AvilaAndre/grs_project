use std::process::Command;
use tauri::AppHandle;

pub struct ComposeConfig {
    name: String,
}

impl ComposeConfig {
    pub fn new(name: String, app_handle: AppHandle) -> Result<Self, &'static str> {
        // TODO: check if a file with this name already exists

        // let _docker_compose_file = app_dir.join(name.clone());

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
