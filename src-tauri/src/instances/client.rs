use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClientInstance {
    pub networks: Vec<String>,
    pub replicas: Option<u8>,
}
