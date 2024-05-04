use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeAppInstance {
    pub networks: Vec<String>,
    pub port: u16,
    pub replicas: Option<u8>,
}
