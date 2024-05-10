import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function AddClientModal() {
	const [name, setName] = createSignal("");
	const [replicas, setReplicas] = createSignal(1);
	const [networkAddress, setNetworkAddress] = createSignal("");
	const [networkName, setNetworkName] = createSignal("");

	const { addNewClientInstance } = configManager;

	async function addNewClient() {
		if (await addNewClientInstance(name(), networkAddress(), replicas())) {
			//reset
			setName("");
			setReplicas(1);
			setNetworkAddress("");
			setNetworkName("");
		}
	}

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
						val = val.trim();
						val = val.replace(" ", "");

						setName(val);
					}}
					class="grow"
					placeholder="Client"
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
						if (val) {
							setNetworkName(val);
							if (val !== "") {
								document
									.getElementById("clientNetworkName")
									?.classList.replace("hidden", "flex");
							} else {
								document
									.getElementById("clientNetworkName")
									?.classList.replace("flex", "hidden");
							}
						}
					}}
				>
					<option selected value=""></option>
					<option value="node-app">Node App</option>
					<option value="client">Client</option>
					<option value="router">Router</option>
					<option value="nginx">Nginx</option>
				</select>
			</div>
			<label
				class="input input-bordered items-center gap-2 hidden"
				id="clientNetworkName"
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
				<form method="dialog" onSubmit={addNewClient}>
					<button
						class="btn"
						disabled={
							!name().length ||
							!(!networkAddress().length || !networkName().length)
						} //(networkAddress().length && networkName().length) --- escrevendo assim dava erro, por isso, usar regra de De Morgan
					>
						Add Instance
					</button>
				</form>
			</div>
		</div>
	);
}
