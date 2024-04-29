use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct NetworkData {
    pub subnet: String,
    pub gateway: String,
}
