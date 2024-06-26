import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";
import verifyIP from "../../../utils/ip-verifier";

export default function AddClientModal() {
	const [name, setName] = createSignal("");
	const [replicas, setReplicas] = createSignal(1);
	const [networkAddress, setNetworkAddress] = createSignal("");
	const [networkName, setNetworkName] = createSignal("");
	const [subnet, setSubnet] = createSignal("");
	const [existingNetworks, setExistingNetworks] = createSignal({});

	const { addNewClientInstance, setExistingNetworksMap } = configManager;

	async function addNewClient() {
		if (
			await addNewClientInstance(
				name(),
				networkAddress(),
				networkName(),
				replicas()
			)
		) {
			//reset
			setName("");
			setReplicas(1);
			setNetworkAddress("");
			setNetworkName("");
		}
	}

	function showOrHideNetworkAddressDiv() {
		const elem = document.getElementById("clientNetworkAddress");

		if (networkName() === "" || replicas() > 1) {
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
				<input
					type="text"
					value={name()}
					onChange={(e: Event) => {
						// @ts-ignore
						let val = e?.target?.value;
						val = val.trim().replace(' ', '').replace('-', '');

						setName(val);
					}}
					class="grow"
					placeholder="Client"
				/>
			</label>
			<label class="input input-bordered flex items-center gap-2">
				Replicas
				<input
					type="number"
					value={replicas()}
					onChange={(e: Event) => {
						// @ts-ignore
						let val = e?.target?.value;
						val = parseInt(val);

						if (val) setReplicas(val);

						showOrHideNetworkAddressDiv();
					}}
					class="grow"
					placeholder="1"
					min="1"
					step="1"
				/>
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
				id="clientNetworkAddress"
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
							"clientNetworkAddress"
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
				<form method="dialog" onSubmit={addNewClient}>
					<button
						class="btn"
						disabled={
							!name().length ||
							!(networkAddress()
								? verifyIP(subnet(), networkAddress())
								: true)
						}
					>
						Add Instance
					</button>
				</form>
			</div>
		</div>
	);
}
