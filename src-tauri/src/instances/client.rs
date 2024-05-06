use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientInstance {
    pub network_address: String, // Something like "172.16.123.66"
    pub replicas: Option<u8>,
}
