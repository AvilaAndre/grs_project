use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct NetworkData {
    pub subnet: String,
    pub gateway: String,
}
