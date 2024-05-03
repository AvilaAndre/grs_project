import { invoke } from "@tauri-apps/api";
import { For, createSignal, onMount } from "solid-js"

export default function InstancesListModal(props: any) {
	const [instancesList, setInstancesList] = createSignal([])

	const config_name = props.config_name;

	async function getConfigsList() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setInstancesList(await invoke("get_instances", { configName: config_name }));
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
							<ul>
								<For each={instancesList().filter((inst) => inst[1] == "Node App")} fallback={<p>No config files found</p>}>{config =>
									<li><a>{config[0]}</a></li>
								}</For>
							</ul>
						</details>
						<details>
							<summary>Client</summary>
							<ul>
								<For each={instancesList().filter((inst) => inst[1] == "Client")} fallback={<p>No config files found</p>}>{config =>
									<li><a>{config[0]}</a></li>
								}</For>
							</ul>
						</details>
					</li>
				</ul>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}

