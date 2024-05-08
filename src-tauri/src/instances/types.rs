use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkData {
    pub network_name: String,
    pub ipv4_address: String,
}
