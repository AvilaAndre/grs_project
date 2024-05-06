use std::io::Write;
use std::{collections::HashMap, io};
use std::fs::File;
use crate::instances::client::ClientInstance;
use crate::instances::nginx::NginxInstance;
use crate::instances::nodeapp::NodeAppInstance;
use crate::instances::router::RouterInstance;

use super::network_data::NetworkData;
use super::ComposeConfig;


pub fn write_docker_compose(mut dock_file: &File, compose_config: &ComposeConfig) -> io::Result<()>{

	let _ = dock_file.write_all(("version: \"3\"\nservices:\n").as_bytes());

	let _ = self::write_node_app_instance(compose_config.node_apps.clone(), &dock_file, 4);
	let _ = self::write_client_instance(compose_config.clients.clone(), &dock_file, 4);
	let _ = self::write_nginx_instance(compose_config.nginxs.clone(), &dock_file, 4);
	let _ = self::write_router_instance(compose_config.routers.clone(), &dock_file, 4);
	
	let _ = dock_file.write_all(("\nnetworks:\n").as_bytes());

	let _ = self::write_network_data(compose_config.networks.clone(), &dock_file, 4);

	Ok(())
}

/**
 * networks_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
pub fn write_node_app_instance(networks_map: Option<HashMap<String, NodeAppInstance>>, mut file: &File, indentation: usize) -> io::Result<()> {

	match networks_map {
		Some(map) => {
			for (key, value) in map {
				
				let networks_string = value.networks.iter().map(|name| {
					format!("{indent}    - {network_name}\n",
							indent = " ".repeat(indentation),
							network_name = name
						)
				}).collect::<String>();
				

				let item = format!(
                    "{indent}{name}:\n{indent}  build: {image}\n{indent}  environment:\n{indent}    - PORT={port}\n{indent}  deploy:\n{indent}    replicas: {replicas}\n{indent}  networks:\n{networks}\n",
                    indent = " ".repeat(indentation),
					name = key,
					image = key, // FIXME TODO mudar isto para o path da image
					port = value.port,
					replicas = value.replicas.unwrap_or(1),
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
					replicas = value.replicas.unwrap_or(1),
					network_name = key, // TODO mudar o nome da network
					network_address = value.network_address // TODO garantir que isto funciona com valores verdadeiros
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

pub fn write_nginx_instance(nginx_instance_map: Option<HashMap<String, NginxInstance>>, mut file: &File, indentation: usize) -> io::Result<()>{

	match nginx_instance_map {
		Some(map) => {
			for (key, value) in map {

				let item = format!(
					"{indent}{key}:\n{indent}  build: {image}\n{indent}  privileged: true\n{indent}  deploy:\n{indent}    resources:\n{indent}      limits:\n{indent}        cpus: \"{cpus_limit}\"\n{indent}        memory: {memory_limit}\n{indent}      reservations:\n{indent}        memory: {memory_reservations}\n{indent}  ports:\n{indent}    - 80\n{indent}  networks:\n{indent}    {network_name}:\n{indent}      ipv4_address: {network_address}\n",
					indent = " ".repeat(indentation),
					image = key, // FIXME TODO mudar isto para o path da image
					key = key,
					cpus_limit = value.cpus_limit,
					memory_limit = value.memory_limit,
					memory_reservations = value.memory_reservations,
					network_address = value.network_address,
					network_name = key// TODO mudar o nome da network
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

pub fn write_router_instance(router_instance_map: Option<HashMap<String, RouterInstance>>, mut file: &File, indentation: usize) -> io::Result<()>{

	match router_instance_map {
		Some(map) => {
			for (key, value) in map {
				let networks_string = value.networks.iter().map(|address| {
					format!("{indent}    {network_name}:\n{indent}      ipv4_address: {network_address}\n",
							indent = " ".repeat(indentation),
							network_name = "name_filler",
							network_address = address)
				}).collect::<String>();

				let item = format!(
				  	"{indent}{key}:\n{indent}  build: {image}\n{indent}  container_name: {key}\n{indent}  hostname: {key}\n{indent}  networks:\n{networks}",
					indent = " ".repeat(indentation),
					image = key, // FIXME TODO mudar isto para o path da image
					key = key,
					networks = networks_string
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