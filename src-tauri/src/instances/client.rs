use serde::{Deserialize, Serialize};

use crate::docker::containerdata::ContainerData;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientInstance {
	pub network_address: String,
    pub network_name: String, // Something like "172.16.123.66"
    pub replicas: u8,
    #[serde(skip_serializing)]
    pub container: Option<ContainerData>,
}
