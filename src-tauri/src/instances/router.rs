use serde::{Deserialize, Serialize};

use super::types::NetworkData;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RouterInstance {
    pub networks: Vec<NetworkData>, // Network addresses
}
