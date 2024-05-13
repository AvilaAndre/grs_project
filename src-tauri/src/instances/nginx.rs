use serde::{Deserialize, Serialize};

use crate::docker::containerdata::ContainerData;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NginxInstance {
	pub network_address: String,
    pub network_name: String,
    pub memory_limit: String,
    pub cpus_limit: String,
    pub memory_reservations: String,
    #[serde(skip_serializing)]
    pub container: Option<ContainerData>,
}
