import { invoke } from "@tauri-apps/api";
import { For, createSignal, onMount } from "solid-js";


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
		<>
			<ul>
				<For each={configsList()} fallback={<p>No config files found</p>}>{config =>
					<li>{config}</li>
				}</For>
			</ul>
			<input type="text" placeholder="New config name" value={newConfigName()} onInput={(e) => setNewConfigName(e.target.value)} />
			<button type="button" onClick={createNewConfig}> Create new config </button>
		</>
	);
};

export { ConfigList }

