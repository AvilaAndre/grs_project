import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";
import verifyIP from "../../../utils/ip-verifier";


export default function AddNginxModal() {
	const [name, setName] = createSignal("");
	const [memoryLimit, setMemoryLimit] = createSignal("10M");
	const [cpusLimit, setCpusLimit] = createSignal("0.80");
	const [memoryReservations, setMemoryReservations] = createSignal("6M");

	const [networkAddress, setNetworkAddress] = createSignal("");
	const [networkName, setNetworkName] = createSignal("");
	const [subnet, setSubnet] = createSignal("");

	const [existingNetworks, setExistingNetworks] = createSignal({});

	const { addNewNginxInstance, setExistingNetworksMap } = configManager;

	async function addNewNginx() {
		if (await addNewNginxInstance(name(), memoryLimit(), cpusLimit(), memoryReservations(), networkAddress(), networkName())) {
			//reset
			setName("");
			setMemoryLimit("10M");
			setCpusLimit("0.80");
			setMemoryReservations("6M");
			setNetworkName("");
			setNetworkAddress("");
		}
	}

	function showOrHideNetworkAddressDiv() {
		const elem = document.getElementById("nginxNetworkAddress");

		if (networkName() === "") {
			elem?.classList.add("hidden");
			elem?.classList.remove("flex");
			setNetworkAddress("");
		} else {
			elem?.classList.add("flex");
			elem?.classList.remove("hidden");
		}
	}

	setExistingNetworksMap(setExistingNetworks);

	return (
		<div class="flex flex-col gap-y-1">
			<label class="input input-bordered flex items-center gap-2">
				Name
				<input type="text" value={name()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = val.trim().replace(' ', '').replace('-', '');

					if (val)
						setName(val)
				}
				} class="grow" placeholder="Nginx" />
			</label>
			<label class="input input-bordered flex items-center gap-2">
				Memory Limit
				<input type="text" value={memoryLimit()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = val.trim()
					val = val.replace(' ', '')

					if (val)
						setMemoryLimit(val)
				}
				} class="grow" placeholder="Nginx" />
			</label>
			<label class="input input-bordered flex items-center gap-2">
				CPU Limit
				<input type="text" value={cpusLimit()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = val.trim()
					val = val.replace(' ', '')

					if (val)
						setCpusLimit(val)
				}
				} class="grow" placeholder="Nginx" />
			</label>
			<label class="input input-bordered flex items-center gap-2">
				Memory Reservations
				<input type="text" value={memoryReservations()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = val.trim()
					val = val.replace(' ', '')

					if (val)
						setMemoryReservations(val)
				}
				} class="grow" placeholder="Nginx" />
			</label>

			<div class="flex">
				<label class="input input-bordered flex items-center gap-2 w-52 mr-1">
					Network Name
				</label>
				<select
					class="select select-bordered w-full"
					value={networkName()}
					onChange={(e: Event) => {
						// @ts-ignore

						const val = e?.target?.value;
						const subnet = document
							.getElementById("network_name_" + val)
							?.getAttribute("data-subnet");

						if (val && subnet && val !== "") {
							setNetworkName(val);
							setSubnet(subnet);
						} else {
							setNetworkName("");
							setSubnet("");
							setNetworkAddress("");
						}

						showOrHideNetworkAddressDiv();
					}}
				>
					<option selected value=""></option>
					{Object.entries(existingNetworks()).length === 0 ? (
						<option disabled>No networks available</option>
					) : (
						Object.entries(existingNetworks()).map(
							([key, value]: any) => (
								<option
									id={"network_name_" + key}
									value={key}
									data-subnet={value.subnet}
								>
									{key}
								</option>
							)
						)
					)}
				</select>
			</div>
			<label
				class="input input-bordered items-center gap-2 hidden"
				id="nginxNetworkAddress"
			>
				Network Address
				<input
					type="text"
					value={networkAddress()}
					onChange={(e: Event) => {
						// @ts-ignore
						let val = e?.target?.value;
						val = val.trim();
						val = val.replace(" ", "");

						setNetworkAddress(val);

						const elem = document.getElementById(
							"nginxNetworkAddress"
						)?.classList;

						if (elem) {
							if (!verifyIP(subnet(), networkAddress())) {
								elem.add("input-error");
								elem.remove("input-success");
							} else {
								elem.remove("input-error");
								elem.add("input-success");
							}
						}
					}}
					class="grow"
					placeholder="172.16.123.66"
				/>
			</label>

			<div class="modal-action">
				<form method="dialog" onSubmit={addNewNginx} >
					<button class="btn" disabled={
						!name().length ||
						!(networkAddress()
							? verifyIP(subnet(), networkAddress())
							: true)
					}>Add Instance</button>
				</form>
			</div>
		</div>
	);
}
