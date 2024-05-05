use std::io::Write;
use std::{collections::HashMap, io};
use std::fs::File;
use crate::instances::nodeapp::NodeAppInstance;



pub fn write_node_app_instance(networks_map: Option<HashMap<String, NodeAppInstance>>, mut file: &File, indentation: usize) -> io::Result<()> {

	match networks_map {
		Some(map) => {
			for (key, value) in map {
				
				let networks_string = format!("- {}", value.networks.join("\n- "));

				let item = format!(
                    "{indent}{name}:\n{indent}  build: {image}\n{indent}  environment:\n{indent}    - PORT={port}\n{indent}  deploy:\n{indent}    replicas: {replicas}\n{indent}  networks:\n{indent}    {networks}\n",
                    indent = " ".repeat(indentation),
					name = key,
					image = key, // FIXME TODO mudar isto para o path da image
					port = value.port,
					replicas = value.replicas.unwrap_or(0),
					networks = networks_string
				);

				file.write_all(item.as_bytes())?;
                println!("{}\n{}\n", networks_string, value);
			}
		}
		None => {
			println!("The option is empty.");
		}
	}

	Ok(())
}