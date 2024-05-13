use std::collections::VecDeque;

use serde::{Deserialize, Serialize};

use super::dockerstats::DockerStats;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ContainerData {
    pub container_id: String,
    pub container_name: String,
    pub stats: VecDeque<DockerStats>,
}
