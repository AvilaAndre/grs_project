import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function AddClientModal() {
	const [name, setName] = createSignal("");
	const [replicas, setReplicas] = createSignal(1);
	const [network, setNetwork] = createSignal("");

	const { addNewClientInstance } = configManager;


	async function addNewClient() {
		if (await addNewClientInstance(name(), network(), replicas())) {
			//reset
			setName("");
			setReplicas(1);
			setNetwork("");
		}
	}

	return (
		<div class="flex flex-col gap-y-1">
			<label class="input input-bordered flex items-center gap-2">
				Name
				<input type="text" value={name()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = val.trim()
					val = val.replace(' ', '')

					setName(val)
				}
				} class="grow" placeholder="Client" />
			</label>
			<label class="input input-bordered flex items-center gap-2">
				Network Address
				<input type="text" value={network()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = val.trim()
					val = val.replace(' ', '')

					setNetwork(val)
				}
				} class="grow" placeholder="172.16.123.66" />
			</label>
			<label class="input input-bordered flex items-center gap-2">
				Replicas
				<input type="number" value={replicas()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = parseInt(val)

					if (val)
						setReplicas(val)
				}} class="grow" placeholder="1" min="1" step="1" />
			</label>
			<div class="modal-action">
				<form method="dialog" onSubmit={addNewClient}>
					<button class="btn" disabled={!name().length || !network().length}>Add Instance</button>
				</form>
			</div>
		</div>
	);
}
