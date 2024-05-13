use serde::{Deserialize, Serialize};

use crate::docker::containerdata::ContainerData;

use super::types::NetworkData;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RouterInstance {
    pub networks: Vec<NetworkData>, // Network addresses
    #[serde(skip_serializing)]
    pub container: Option<ContainerData>,
}
