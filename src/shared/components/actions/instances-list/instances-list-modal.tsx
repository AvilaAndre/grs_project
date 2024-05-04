import { invoke } from "@tauri-apps/api";
import { For, createSignal, onMount } from "solid-js"
import instanceManager from "../../../stores/actions-instance"

export default function InstancesListModal(props: any) {
	const [instancesList, setInstancesList] = createSignal([])
	const { selectInstance } = instanceManager;

	const config_name = props.config_name;

	async function getConfigsList() {
		setInstancesList(await invoke("get_instances_names", { configName: config_name }));
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
						<details>
							<summary>Node App</summary>
							<form method="dialog">
								<ul>
									<For each={instancesList().filter((inst) => inst[1] == "Node App")} fallback={<p>No config files found</p>}>{config =>
										<li><button onClick={() => selectInstance(config[0], config_name)}>{config[0]}</button></li>
									}</For>
								</ul>
							</form>
						</details>
						<details>
							<summary>Client</summary>
							<form method="dialog">
								<ul>
									<For each={instancesList().filter((inst) => inst[1] == "Client")} fallback={<p>No config files found</p>}>{config =>
										<li><button onClick={() => selectInstance(config[0], config_name)}>{config[0]}</button></li>
									}</For>
								</ul>
							</form>
						</details>
					</li>
				</ul>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog >
	);
}

