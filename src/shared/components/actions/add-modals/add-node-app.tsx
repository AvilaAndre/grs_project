import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";
import verifyIP from "../../../utils/ip-verifier";

export default function AddNodeAppModal() {
	const [name, setName] = createSignal("");
	const [replicas, setReplicas] = createSignal(1);

	const [networkAddress, setNetworkAddress] = createSignal("");
	const [networkName, setNetworkName] = createSignal("");
	const [subnet, setSubnet] = createSignal("");

	const [existingNetworks, setExistingNetworks] = createSignal({});

	const { addNewNodeAppInstance, setExistingNetworksMap } = configManager;

	async function addNewNode() {
		if (await addNewNodeAppInstance(name(), networkName(), networkAddress(), replicas())) {
			//reset
			setName("");
			setReplicas(1);
			setNetworkName("");
			setNetworkAddress("");
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
						let val: string = e?.target?.value;
						val = val.trim();
						val = val.replace(" ", "");

						if (val) setName(val.toLowerCase());
					}}
					class="grow"
					placeholder="NodeApp"
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
							document
								.getElementById("nodeAppNetworkAddress")
								?.classList.replace("hidden", "flex");
						} else {
							setNetworkName("");
							setSubnet("");
							setNetworkAddress("");
							document
								.getElementById("nodeAppNetworkAddress")
								?.classList.replace("flex", "hidden");
						}
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
				id="nodeAppNetworkAddress"
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
							"nodeAppNetworkAddress"
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
					}}
					class="grow"
					placeholder="1"
					min="1"
					step="1"
				/>
			</label>
			<div class="modal-action">
				<form method="dialog" onSubmit={addNewNode}>
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
