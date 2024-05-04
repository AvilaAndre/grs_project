pub mod nodeapp;
pub mod client;

use serde::Serialize;

use self::{client::ClientInstance, nodeapp::NodeAppInstance};

#[derive(Serialize, Clone)]
pub enum Instance {
    NodeApp(NodeAppInstance),
    Client(ClientInstance),
}
