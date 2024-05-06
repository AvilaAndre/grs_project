use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RouterInstance {
    pub networks: Vec<String>, // Network addresses
}
