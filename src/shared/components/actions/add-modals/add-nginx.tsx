import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";
import toast from "solid-toast";

export default function AddNginxModal(props: any) {
	const [name, setName] = createSignal("");
	const [memoryLimit, setMemoryLimit] = createSignal("10M");
	const [cpusLimit, setCpusLimit] = createSignal("0.80");
	const [memoryReservations, setMemoryReservations] = createSignal("6M");

	const config_name = props.config_name;

	async function addNewNginx() {
		await invoke("add_nginx_instance_to_config", {
			configName: config_name,
			instanceName: name(),
			memoryLimit: memoryLimit(),
			cpusLimit: cpusLimit(),
			memoryReservations: memoryReservations(),
		}).then((add) => {
			if (!add) toast.error(name() + " Nginx instance could not be created.")
			else {
				toast.success(name() + " Nginx instance created.")

				//reset
				setName("");
				setMemoryLimit("10M");
				setCpusLimit("0.80");
				setMemoryReservations("6M");
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
			<div class="modal-action">
				<form method="dialog" onSubmit={addNewNginx}>
					<button class="btn">Add Instance</button>
				</form>
			</div>
		</div>
	);
}
