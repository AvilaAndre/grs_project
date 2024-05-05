use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkData {
    pub subnet: String,
    pub gateway: String,
}
