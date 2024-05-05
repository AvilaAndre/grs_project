import { Match, Show, Switch, createSignal } from "solid-js"
import AddNodeAppModal from "./add-node-app";
import AddClientModal from "./add-client";
import AddNginxModal from "./add-nginx";
import AddRouterModal from "./add-router";

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
						<option value="client">Client</option>
						<option value="router">Router</option>
						<option value="nginx">Nginx</option>
					</select>
				</label>
				<Switch fallback={<div></div>}>
					<Match when={instanceOption() == "node-app"} >
						<AddNodeAppModal config_name={config_name} />
					</Match>
					<Match when={instanceOption() == "client"} >
						<AddClientModal config_name={config_name} />
					</Match>
					<Match when={instanceOption() == "nginx"} >
						<AddNginxModal config_name={config_name} />
					</Match>
					<Match when={instanceOption() == "router"} >
						<AddRouterModal config_name={config_name} />
					</Match>
				</Switch>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}

