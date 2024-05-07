import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function AddRouterModal() {
	const [name, setName] = createSignal("");

	const { addNewRouterInstance } = configManager;

	async function addNewRouter() {
		if (await addNewRouterInstance(name())) {
			//reset
			setName("");
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
				} class="grow" placeholder="Router" />
			</label>
			<div class="modal-action">
				<form method="dialog" onSubmit={addNewRouter}>
					<button class="btn">Add Instance</button>
				</form>
			</div>
		</div>
	);
}
