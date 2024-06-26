use crate::instances::client::ClientInstance;
use crate::instances::nginx::NginxInstance;
use crate::instances::nodeapp::NodeAppInstance;
use crate::instances::router::RouterInstance;
use crate::instances::types::NetworkData as NetData;

use std::fs::File;
use std::io::Write;
use std::{collections::HashMap, io};

use super::network_data::NetworkData;
use super::ComposeConfig;

pub fn write_docker_compose(
    mut dock_file: &File,
    compose_config: &ComposeConfig,
	filepath: String
) -> io::Result<()> {
	
	let _ = dock_file.write_all(("services:\n").as_bytes());
	
	if compose_config.node_apps.is_some() || compose_config.clients.is_some() || compose_config.nginxs.is_some() {
		
		let _ = self::write_node_app_instance(compose_config.node_apps.clone(), &dock_file, 4);
		let _ = self::write_client_instance(compose_config.clients.clone(), &dock_file, 4);
		let _ = self::write_nginx_instance(compose_config.nginxs.clone(), &dock_file, 4);
	}

	let _ = self::write_router_instance(compose_config.routers.clone(), &dock_file, create_dns_router(compose_config.networks.clone()),  4);	
	let _ = self::write_dns_conf(&compose_config.name, &dock_file, filepath, 4);

	if compose_config.networks.is_some() {

		let _ = dock_file.write_all(("\nnetworks:\n").as_bytes());
		
		let _ = self::write_network_data(compose_config.networks.clone(), &dock_file, 4);
	}

    Ok(())
}

fn write_networks_if_needed(item: String, network_name: String, network_address: String, indentation: usize) -> String{

	if network_name.len() > 0 {
		let networks_string;
		
		if network_address.len() > 0 {
			networks_string = format!(
				"{indent}    {network_name}:\n{indent}      ipv4_address: {network_address}\n",
				indent = " ".repeat(indentation),
				network_name = network_name,
				network_address = network_address
			);
		} else {
			networks_string = format!(
				"{indent}    - {network_name}\n",
				indent = " ".repeat(indentation),
				network_name = network_name
			);
		}

		return item.clone() + format!("{indent}  networks:\n{networks}\n",
			indent = " ".repeat(indentation),
			networks = networks_string,
		).clone().as_str();
	} else {
		return item.clone() + "\n";
	}

}


/**
 * networks_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
pub fn write_node_app_instance(
    node_app_map: Option<HashMap<String, NodeAppInstance>>,
    mut file: &File,
    indentation: usize,
) -> io::Result<()> {
    match node_app_map{
        Some(map) => {

            file.write_all(format!("{}## NodeApp Instances\n", " ".repeat(indentation)).as_bytes())?;

            for (key, value) in map {

                let mut item = format!(
                    "{indent}{name}:\n{indent}  build: {image}\n{indent}  environment:\n{indent}    - PORT=5050\n{indent}  deploy:\n{indent}    replicas: {replicas}\n",
                    indent = " ".repeat(indentation),
					name = key,
					image = "./images/node-app",
					replicas = value.replicas,
				);

                item = write_networks_if_needed(item, value.network_name, value.network_address, indentation);

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
pub fn write_client_instance(
    clients_map: Option<HashMap<String, ClientInstance>>,
    mut file: &File,
    indentation: usize,
) -> io::Result<()> {
    match clients_map {
        Some(map) => {
            file.write_all(format!("{}## Client Instances\n", " ".repeat(indentation)).as_bytes())?;

            for (key, value) in map {
                let mut item = format!(
                   "{indent}{key}:\n{indent}  build: {image}\n{indent}  deploy:\n{indent}    replicas: {replicas}\n{indent}  tty: true\n",
                    indent = " ".repeat(indentation),
					key = key,
					image = "./images/baseimage", 
					replicas = value.replicas,
				);

                item = write_networks_if_needed(item, value.network_name, value.network_address, indentation);

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
 * network_data_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
pub fn write_network_data(
    network_data_map: Option<HashMap<String, NetworkData>>,
    mut file: &File,
    indentation: usize,
) -> io::Result<()> {
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

/**
 * nginx_instance_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
pub fn write_nginx_instance(
    nginx_instance_map: Option<HashMap<String, NginxInstance>>,
    mut file: &File,
    indentation: usize,
) -> io::Result<()> {
    match nginx_instance_map {
        Some(map) => {
            file.write_all(format!("{}## Nginx Instances\n", " ".repeat(indentation)).as_bytes())?;

            for (key, value) in map {
                let mut item = format!(
					"{indent}{key}:\n{indent}  build: {image}\n{indent}  privileged: true\n{indent}  deploy:\n{indent}    resources:\n{indent}      limits:\n{indent}        cpus: \"{cpus_limit}\"\n{indent}        memory: {memory_limit}\n{indent}      reservations:\n{indent}        memory: {memory_reservations}\n{indent}  ports:\n{indent}    - 80\n",
					indent = " ".repeat(indentation),
					image = "./images/nginx",
					key = key,
					cpus_limit = value.cpus_limit,
					memory_limit = value.memory_limit,
					memory_reservations = value.memory_reservations,
				);

                item = write_networks_if_needed(item, value.network_name, value.network_address, indentation);

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
 * router_instance_map: HashMap to be written in Docker Compose File
 * file: pointer to the file to write to
 * indentation: number of spaces that will be added before every line written. Should be a multiple of 2
 */
pub fn write_router_instance(
    router_instance_map: Option<HashMap<String, RouterInstance>>,
    mut file: &File,
	dns_router: Option<RouterInstance>,
    indentation: usize,
) -> io::Result<()> {

	let mut complete_map: HashMap<String, RouterInstance>;

	match router_instance_map{
		Some(map) => {
			complete_map = map;
		}
		None => {
			complete_map = HashMap::new();
		}
	}

	match dns_router.clone() {
		Some(router) => {
			complete_map.insert("dns_networks_router".to_owned(), router);
		}
		None => {}
	}

	if complete_map.len() > 0 {
		file.write_all(format!("\n{}## Router Instances\n", " ".repeat(indentation)).as_bytes())?;

		for (key, value) in complete_map {

			let mut item = format!(
				"{indent}{key}:\n{indent}  build: {image}\n{indent}  hostname: {key}\n",
				indent = " ".repeat(indentation),
				image = "./images/baseimage",
				key = key
			);
			
			if value.networks.len() > 0 {
				let networks_string = value.networks.iter().map(|network| {
					format!("{indent}    {network_name}:\n{indent}      ipv4_address: {network_address}\n",
							indent = " ".repeat(indentation),
							network_name = network.network_name, 
							network_address = network.ipv4_address)
				}).collect::<String>();

				item += &format!("{indent}  networks:\n{networks}\n", indent=" ".repeat(indentation), networks = networks_string);
			} else {
				item += "\n";
			}
			
			file.write_all(item.as_bytes())?;
		}
    }

    Ok(())
}


/**
 * Writes the DNS instance. Fixed IP of 192.168.1.2 in network 192.168.1.0/30.
 */
pub fn write_dns_conf(conf_name: &String, mut file: &File, filepath: String, indentation: usize) -> io::Result<()> {

	file.write_all(format!("\n{}## DNS Configuration\n", " ".repeat(indentation)).as_bytes())?;

	let container_name = conf_name.to_string() + "_dns";
	let network_name = container_name.clone() + "_net";

	let item = format!(
		"{indent}{container_name}:\n{indent}  image: internetsystemsconsortium/bind9:9.16\n{indent}  container_name: {container_name}\n{indent}  volumes:\n{indent}    - {path}/dns.{conf_name}.net:/etc/bind/dns.{conf_name}.net\n{indent}    - {path}/{conf_name}.conf.local:/etc/bind/{conf_name}.conf.local\n{indent}    - /var/cache/bind\n{indent}    - /var/lib/bind\n{indent}  networks:\n{indent}    {network_name}:\n{indent}      ipv4_address: 192.168.1.2\n{indent}  cap_add:\n{indent}    - NET_ADMIN\n",
		indent=" ".repeat(indentation),
		container_name = container_name,
		network_name = network_name,
		conf_name = conf_name,
		path = filepath
	);

	file.write_all(item.as_bytes())?;

	Ok(())
}


fn create_dns_router(network_data_map: Option<HashMap<String, NetworkData>>) -> Option<RouterInstance> {

	let mut networks_format:Vec<NetData> = vec![];

	match network_data_map{
		Some(map) => {

			for (key, value) in map {
				if value.dns_endpoint.is_some() {
					let item: NetData = NetData{ network_name: key.clone(), ipv4_address: value.clone().dns_endpoint.unwrap() };
					networks_format.push(item);
				}
			}

		}
		None => {
			println!("No networks exist.");
			return None;
		}
	}
		
	Some(RouterInstance {
		networks: networks_format
	})
}
