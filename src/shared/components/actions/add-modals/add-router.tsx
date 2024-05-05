import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";
import toast from "solid-toast";

export default function AddRouterModal(props: any) {
	const [name, setName] = createSignal("");

	const config_name = props.config_name;

	async function addNewNginx() {
		await invoke("add_router_instance_to_config", {
			configName: config_name,
			instanceName: name(),
		}).then((add) => {
			if (!add) toast.error(name() + " Router instance could not be created.")
			else {
				toast.success(name() + " Router instance created.")

				//reset
				setName("");
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
				} class="grow" placeholder="Router" />
			</label>
			<div class="modal-action">
				<form method="dialog" onSubmit={addNewNginx}>
					<button class="btn">Add Instance</button>
				</form>
			</div>
		</div>
	);
}
