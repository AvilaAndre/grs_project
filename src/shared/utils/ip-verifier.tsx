import { Netmask } from "netmask";

/**
 * Verifies if the given IP belongs to the given subnet
 * @param subnet Subnet in which the IP will be verified to be a part of - String: '123.123.208.0/20'
 * @param ip_address IP address to verify - String: '123.123.208.0'
 * @returns boolean - true if IP address in subnet, false if not
 */
function verifyIP(subnet: string, ip_address: string) {
	if (subnet === "") {
		return true;
	}

	try {
		const block = new Netmask(subnet);
		if (block) {
			return block.contains(ip_address);
		} else {
			console.log("Provided subnet is not valid.");
			return false;
		}
	} catch (error) {
		console.log("IP Address is not valid.");
		return false;
	}
}

export default verifyIP;
