import { invoke } from "@tauri-apps/api";
import { For, createSignal, onMount } from "solid-js";


const ConfigList = () => {
	const [configsList, setConfigsList] = createSignal([]);

	async function getConfigsList() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setConfigsList(await invoke("get_configs", {}));
		console.log("list", configsList())
	}

	onMount(async () => {
		await getConfigsList()
	})

	return (
		<ul>
			<For each={configsList()} fallback={<p>No config files found</p>}>{config =>
				<li>{config}</li>
			}</For>
		</ul>
	);
};

export { ConfigList }

