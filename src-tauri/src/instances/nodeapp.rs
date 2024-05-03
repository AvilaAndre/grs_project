use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NodeAppInstance {
    pub networks: Vec<String>,
    pub port: u16,
    pub replicas: Option<u8>,
}
