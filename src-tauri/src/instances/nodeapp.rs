use serde::{Deserialize, Serialize};

use crate::docker::containerdata::ContainerData;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeAppInstance {
	pub network_address: String,
    pub network_name: String,
    pub replicas: u8,
    #[serde(skip_serializing)]
    pub container: Option<ContainerData>,
}
