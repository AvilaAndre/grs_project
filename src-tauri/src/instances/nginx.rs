use serde::{Deserialize, Serialize};

use super::types::NetworkData;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NginxInstance {
    pub networks: Vec<NetworkData>,
    pub memory_limit: String,
    pub cpus_limit: String,
    pub memory_reservations: String,
}
