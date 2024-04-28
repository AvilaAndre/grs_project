import { invoke } from "@tauri-apps/api";
import { For, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";

const ConfigList = () => {
	const [configsList, setConfigsList] = createSignal([]);
	const [newConfigName, setNewConfigName] = createSignal("");

	async function getConfigsList() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setConfigsList(await invoke("get_configs", {}));
	}

	async function createNewConfig() {
		let response = await invoke("create_compose_config", { name: newConfigName() }).then((list) => list).catch((error) => error);

		if (typeof (response) == "string") {
			// TODO: Error handling
		} else {
			// response will be an array, but typescript sees it as unknown
			// @ts-ignore
			setConfigsList(response)
		}

		setNewConfigName("")
	}


	onMount(async () => {
		await getConfigsList()
	})

	return (
		<div class="w-96 max-w-md">
			<ul class="flex flex-col gap-y-2 max-h-96 overflow-y-scroll">
				<For each={configsList()} fallback={<p>No config files found</p>}>{config =>
					<li>
						<A href={"/actions/" + config} class="btn btn-neutral w-full">
							{config}
						</A>
					</li>
				}</For>
			</ul>
			<div class="flex flex-col gap-y-2 mt-4">
				<input type="text" placeholder="New config name" value={newConfigName()} onInput={(e) => setNewConfigName(e.target.value)} class="input input-bordered w-full" />
				<button class="btn btn-primary w-full" onClick={createNewConfig}>Create new config</button>
			</div>
		</div>
	);
};

export { ConfigList }

