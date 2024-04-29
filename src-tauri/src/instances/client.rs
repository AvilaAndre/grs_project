use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct ClientInstance {
    pub networks: Vec<String>,
    pub replicas: Option<u8>,
}
