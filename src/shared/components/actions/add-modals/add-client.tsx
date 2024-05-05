import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";
import toast from "solid-toast";

export default function AddClientModal(props: any) {
	const [name, setName] = createSignal("");
	const [replicas, setReplicas] = createSignal(1);
	const [networks, setNetworks] = createSignal([]);

	const config_name = props.config_name;

	async function addNewClient() {
		await invoke("add_client_instance_to_config", {
			configName: config_name,
			instanceName: name(),
			networks: networks(),
			replicas: replicas()
		}).then((add) => {
			if (!add) toast.error(name() + " Client instance could not be created.")
			else {
				toast.success(name() + " Client instance created.")

				//reset
				setName("");
				setReplicas(1);
				setNetworks([]);
			}
		}).catch((error) => {
			toast.error(error)
		});
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
				} class="grow" placeholder="Client" />
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
					<button class="btn">Add Instance</button>
				</form>
			</div>
		</div>
	);
}
