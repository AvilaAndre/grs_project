use std::io::Write;
use std::{collections::HashMap, io};
use std::fs::File;
use crate::instances::client::ClientInstance;
use crate::instances::nodeapp::NodeAppInstance;

use super::network_data::NetworkData;


/**
 * networks_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
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
					networks = networks_string // TODO verificar se isto funciona depois de implementar o resto
				);

				file.write_all(item.as_bytes())?;
			}
		}
		None => {
			println!("The option is empty.");
		}
	}

	Ok(())
}

/**
 * clients_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
pub fn write_client_instance(clients_map: Option<HashMap<String, ClientInstance>>, mut file: &File, indentation: usize) -> io::Result<()> {

    match clients_map {
		Some(map) => {
			for (key, value) in map {

				let item = format!(
                   "{indent}{key}:\n{indent}  build: {image}\n{indent}    container_name: {key}\n{indent}  deploy:\n{indent}    replicas: {replicas}\n{indent}  tty: true\n{indent}  networks:\n{indent}    {network_name}:\n{indent}      ipv4_address: {network_address}\n",
                    indent = " ".repeat(indentation),
					key = key,
					image = key, // FIXME TODO mudar isto para o path da image
					replicas = value.replicas.unwrap_or(0),
					network_name = key, // TODO mudar o nome da network
					network_address = value.network // TODO garantir que isto funciona com valores verdadeiros
				);

				file.write_all(item.as_bytes())?;
			}
		}
		None => {
			println!("The option is empty.");
		}
	}

    Ok(())
}


pub fn write_network_data(network_data_map: Option<HashMap<String, NetworkData>>, mut file: &File, indentation: usize) -> io::Result<()>{

	match network_data_map {
		Some(map) => {
			for (key, value) in map {

				let item = format!(
				   "{indent}{key}:\n{indent}  ipam:\n{indent}    config:\n{indent}      - subnet: {subnet}\n{indent}        gateway: {gateway}\n",
					indent = " ".repeat(indentation),
					key = key,
					subnet = value.subnet,
					gateway = value.gateway
				);
				file.write_all(item.as_bytes())?;
			}
		}
		None => {
			println!("The option is empty.");
		}
	}

	Ok(())
}