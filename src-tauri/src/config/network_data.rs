use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NetworkData {
    pub subnet: String,
    pub gateway: String,
	pub dns_endpoint: Option<String>,
}
