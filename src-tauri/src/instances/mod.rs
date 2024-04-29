pub mod nodeapp;
pub mod client;

use self::{client::ClientInstance, nodeapp::NodeAppInstance};

pub enum Instance {
    NodeApp(NodeAppInstance),
    Client(ClientInstance),
}
