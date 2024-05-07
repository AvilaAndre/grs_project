use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeAppInstance {
    pub network_names: Vec<String>, // Network names 
    pub replicas: u8,
}

impl std::fmt::Display for NodeAppInstance {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let _ = write!(f, "Networks: {:?}\n", self.network_names)?;
        let _ = write!(f, "Replicas: {:?}\n", self.replicas);

        Ok(())
    }
}
