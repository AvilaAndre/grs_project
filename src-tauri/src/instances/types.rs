use serde::{Deserialize, Serialize};
use std::default::Default;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkData {
    pub network_name: String,
    pub ipv4_address: String,
}

impl Default for NetworkData {
	fn default() -> Self {
		Self {
			network_name: String::new(),
			ipv4_address: String::new(),
		}
	}
}