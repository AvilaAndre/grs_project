use std::fs::File;
use std::io::Write;


/**  
 * Creates two DNS config files: dns.{conf-name}.net and {conf-name}.conf.local in the specified filepath.
*/
pub fn write_dns_files(filepath: String, config_name: String) -> Result<bool, String> {
	let _ = create_dns_bind(filepath.clone(), config_name.clone());
	let _ = create_dns_conf(filepath, config_name);

	Ok(true)
}


fn create_dns_bind(filepath: String, config_name: String) -> Result<bool, String> {

	let filename = "dns.".to_owned()+&config_name+".net";

	let mut file = match File::create(filepath.to_owned() + "/" + &filename) {
		Ok(f) => f,
		Err(_) => return Err("Couldn't create file to write".to_owned()),
	};

	let item = format!(

		"$TTL 604800\n@   IN  SOA ns.{config_name}.net. admin.{config_name}.net. (\n    2016010101  ; Serial\n    3600        ; Refresh\n    1800        ; Retry\n    604800      ; Expire\n    86400       ; Minimum TTL\n)\n@ IN NS ns.{config_name}.net.\n",
		config_name = config_name
	);

	let _ = file.write_all(item.as_bytes());

	Ok(true)
}


fn create_dns_conf(filepath: String, config_name: String) -> Result<bool, String> {

	let filename = config_name.clone() + ".conf.local";

	let mut file = match File::create(filepath.to_owned() + "/" + &filename) {
		Ok(f) => f,
		Err(_) => return Err("Couldn't create file to write".to_owned()),
	};

	let item = format!(
		"zone \"{conf_name}.net\" {{\n	type master;\n	file \"/etc/bind/dns.{conf_name}.net\";\n}};\n",
		conf_name = config_name
	);
		
	let _ = file.write_all(item.as_bytes());

	Ok(true)
}