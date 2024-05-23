use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeAppInstance {
    pub network_address: String,
    pub network_name: String,
    pub replicas: u8,
}
