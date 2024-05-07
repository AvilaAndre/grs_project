import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function AddNodeAppModal() {
	const [name, setName] = createSignal("");
	const [replicas, setReplicas] = createSignal(1);
	const [network_names, setNetworkNames] = createSignal([]);

	const { addNewNodeAppInstance } = configManager;

	async function addNewNode() {
		if (await addNewNodeAppInstance(name(), network_names(), replicas())) {
			//reset
			setName("");
			setReplicas(1);
			setNetworkNames([]);
		}
	}

	// TODO: Add network names dropdown

	return (
		<div class="flex flex-col gap-y-1">
			<label class="input input-bordered flex items-center gap-2">
				Name
				<input type="text" value={name()} onChange={(e: Event) => {
					// @ts-ignore
					let val: string = e?.target?.value
					val = val.trim()
					val = val.replace(' ', '')

					if (val)
						setName(val.toLowerCase())
				}
				} class="grow" placeholder="NodeApp" />
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
				<form method="dialog" onSubmit={addNewNode}>
					<button class="btn">Add Instance</button>
				</form>
			</div>
		</div>
	);
}
