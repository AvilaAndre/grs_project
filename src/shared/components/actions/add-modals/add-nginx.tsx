import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function AddNginxModal() {
	const [name, setName] = createSignal("");
	const [memoryLimit, setMemoryLimit] = createSignal("10M");
	const [cpusLimit, setCpusLimit] = createSignal("0.80");
	const [memoryReservations, setMemoryReservations] = createSignal("6M");

	const { addNewNginxInstance } = configManager;

	async function addNewNginx() {
		if (await addNewNginxInstance(name(), memoryLimit(), cpusLimit(), memoryReservations())) {
			//reset
			setName("");
			setMemoryLimit("10M");
			setCpusLimit("0.80");
			setMemoryReservations("6M");
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
