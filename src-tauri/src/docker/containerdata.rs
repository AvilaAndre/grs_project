use std::collections::VecDeque;

use serde::{Deserialize, Serialize};

use super::dockerstats::DockerStats;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ContainerData {
    pub container_id: String,
    pub container_name: String,
    pub stats: VecDeque<DockerStats>,
}

const STATS_CAPACITY: usize = 50;

impl ContainerData {
    pub fn add_stats(self, stats: DockerStats) -> ContainerData {
        let mut res = self.clone();

        if res.stats.len() == STATS_CAPACITY {
            res.stats.pop_front();
        }
        res.stats.push_back(stats);

        return res;
    }
}
