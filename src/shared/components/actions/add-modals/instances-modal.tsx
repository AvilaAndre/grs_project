import { Show, createSignal } from "solid-js"
import AddNodeAppModal from "./add-node-app";
import AddClientModal from "./add-client";

export default function InstancesModal(props: any) {
	const [instanceOption, setInstanceOption] = createSignal("");

	const config_name = props.config_name;

	return (
		<dialog id="instances_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
				</form>
				<h3 class="font-bold text-lg mb-5">Add New Instance</h3>
				<label class="form-control w-full mb-4">
					<p class="mb-1">Instance Type </p>
					<select class="select select-bordered" value={instanceOption()} onChange={(e: Event) => {
						// @ts-ignore
						const val = e?.target?.value
						if (val)
							setInstanceOption(val)
					}}>
						<option disabled selected value="" >Pick one instance type</option>
						<option value="node-app">Node App</option>
						<option value="router">Router</option>
						<option value="client">Client</option>
					</select>
				</label>
				<Show when={instanceOption() == "node-app"} >
					<AddNodeAppModal config_name={config_name} />
				</Show>
				<Show when={instanceOption() == "client"} >
					<AddClientModal config_name={config_name} />
				</Show>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}

