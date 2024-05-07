import { For, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import configManager from "../../stores/config-manager";

const ConfigList = () => {
	const [configsList, setConfigsList] = createSignal([]);
	const [newConfigName, setNewConfigName] = createSignal("");

	const { getConfigsList, createNewConfig } = configManager;

	const refreshConfigsList = async () => {
		setConfigsList(await getConfigsList())
	}

	onMount(async () => {
		await refreshConfigsList()
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
				<input type="text" placeholder="New config name" value={newConfigName()} onInput={(e) => {
					let val = e.target.value
					val = val.trim()
					val = val.replace(' ', '')

					setNewConfigName(val)
				}
				} class="input input-bordered w-full" />
				<div class="flex flex-row w-full gap-x-1">
					<button class="btn btn-primary w-full shrink" onClick={() => createNewConfig(newConfigName())} disabled={newConfigName() == ""}>Create new config</button>
					<button class="btn btn-secondary btn-square shrink-0" onClick={refreshConfigsList}>
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export { ConfigList }

