pub mod client;
pub mod nginx;
pub mod nodeapp;
pub mod router;

use serde::Serialize;

use self::{
    client::ClientInstance, nginx::NginxInstance, nodeapp::NodeAppInstance, router::RouterInstance,
};

#[derive(Serialize, Clone)]
pub enum Instance {
    NodeApp(NodeAppInstance),
    Client(ClientInstance),
    Nginx(NginxInstance),
    Router(RouterInstance),
}
