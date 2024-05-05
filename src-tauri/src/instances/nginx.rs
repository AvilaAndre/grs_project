use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NginxInstance {
    pub networks: Vec<String>,
    pub memory_limit: String,
    pub cpus_limit: String,
    pub memory_reservations: String,
}
