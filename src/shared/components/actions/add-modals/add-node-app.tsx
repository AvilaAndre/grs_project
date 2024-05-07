import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function AddNodeAppModal() {
	const [name, setName] = createSignal("");
	const [port, setPort] = createSignal(5000);
	const [replicas, setReplicas] = createSignal(1);
	const [networks, setNetworks] = createSignal([]);

	const { addNewNodeAppInstance } = configManager;

	async function addNewNode() {
		if (await addNewNodeAppInstance(name(), networks(), port(), replicas())) {
			//reset
			setName("");
			setPort(5000);
			setReplicas(1);
			setNetworks([]);
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

					if (val)
						setName(val)
				}
				} class="grow" placeholder="NodeApp" />
			</label>
			<label class="input input-bordered flex items-center gap-2" >
				Port
				<input type="number" value={port()} onChange={(e: Event) => {
					// @ts-ignore
					let val = e?.target?.value
					val = parseInt(val)

					if (val)
						setPort(val)
				}
				} class="grow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="5000" />
			</label >
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
