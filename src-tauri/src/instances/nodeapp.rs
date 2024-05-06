use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeAppInstance {
    pub networks: Vec<String>, // Network names 
    pub port: u16,
    pub replicas: Option<u8>,
}

impl std::fmt::Display for NodeAppInstance {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let _ = write!(f, "Networks: {:?}\n", self.networks)?;
        let _ = write!(f, "Port: {}\n", self.port)?;
        let _ = write!(f, "Replicas: {:?}\n", self.replicas);

        Ok(())
    }
}
