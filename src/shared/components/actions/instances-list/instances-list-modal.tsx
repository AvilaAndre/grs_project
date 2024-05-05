import { invoke } from "@tauri-apps/api";
import { For, createSignal, onMount } from "solid-js"
import instanceManager from "../../../stores/actions-instance"

type InstanceName = {
	name: String,
	type: String
}

export default function InstancesListModal(props: any) {
	const emptyInstanceList: InstanceName[] = [];
	const [instancesList, setInstancesList] = createSignal(emptyInstanceList);
	const { selectInstance } = instanceManager;

	const config_name = props.config_name;

	async function getConfigsList() {
		let instances: any[] = await invoke("get_instances", { configName: config_name });

		let instance_names: InstanceName[] = []

		for (let i = 0; i < instances.length; i++) {
			instance_names.push({
				name: instances[i][0],
				type: Object.keys(instances[i][1])[0]
			})
		}

		setInstancesList(instance_names)
	}

	onMount(() =>
		getConfigsList()
	)

	return (
		<dialog id="instances_list_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
				</form>
				<h3 class="font-bold text-lg mb-5">Instances</h3>
				<ul class="menu w-full rounded-box">
					<li>
						<For each={["NodeApp", "Client", "Nginx", "Router"]} fallback={<div />}>{instanceType =>
							<details>
								<summary>{instanceType}</summary>
								<form method="dialog">
									<ul>
										<For each={instancesList().filter((inst) => inst.type == instanceType).map((inst) => inst.name)} fallback={<p>No config files found</p>}>{(inst_name: String) =>
											<li><button onClick={() => selectInstance(inst_name, config_name)}>{inst_name}</button></li>
										}</For>
									</ul>
								</form>
							</details>
						}</For>
					</li>
				</ul>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog >
	);
}

