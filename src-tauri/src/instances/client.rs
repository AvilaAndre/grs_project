use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientInstance {
	pub network_address: String,
    pub network_name: String, // Something like "172.16.123.66"
    pub replicas: u8,
}
