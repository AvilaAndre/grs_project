use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientInstance {
    pub network: String, // Assumed to be the network address, something like "172.16.123.66"
    pub replicas: Option<u8>,
}
