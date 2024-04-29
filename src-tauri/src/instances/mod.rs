use self::nodeapp::NodeAppInstance;

pub mod nodeapp;

pub enum Instance {
    NodeApp(NodeAppInstance),
}
