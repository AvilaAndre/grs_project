pub mod nodeapp;
pub mod client;

use serde::Serialize;

use self::{client::ClientInstance, nodeapp::NodeAppInstance};

#[derive(Serialize)]
pub enum Instance {
    NodeApp(NodeAppInstance),
    Client(ClientInstance),
}
