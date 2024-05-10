import { A } from "@solidjs/router"
import TaskBar from "../shared/components/actions/taskbar"
import InstanceOptionsBar from "../shared/components/instance/instance-options-bar"
import { invoke } from "@tauri-apps/api";
import { createSignal, onMount } from "solid-js";
import configManager from "../shared/stores/config-manager";

export default function ActionsPage(props: any) {
	const config_name = props.params.id
	const [gettingStats, setGettingStats] = createSignal(false);

	const { setSelectedConfig, getContainerStats } = configManager;

	async function startConfigDocker() {
		console.log(await invoke("start_config_docker", { configName: config_name }));
	}

	onMount(async () => {
		setSelectedConfig(config_name)
		if (!gettingStats()) {
			setGettingStats(true);
			// setInterval(() => getContainerStats(), 1000); commented because it breaks the application if reloaded
		}
	});

	return (
		<>
			<div class="flex flex-row w-screen">
				<section class="w-full">
					<div class="w-full h-fit grid grid-cols-3 p-2">
						<A href={"/configs"} class="btn btn-neutral btn-circle">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
							</svg>
						</A>
						<h3 class="text-2xl justify-self-center"> {props.params.id} </h3>
						<div class="join grid grid-cols-2 w-fit justify-self-end">
							<button onClick={startConfigDocker} class="join-item btn btn-square btn-info">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Z" />
								</svg>
							</button>
							<button class="join-item btn btn-square btn-error">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-240v-480h480v480H240Z" />
								</svg>
							</button>
						</div>
					</div>

					<TaskBar />
				</section>
				<section class="w-fit">
					<InstanceOptionsBar />
				</section>
			</div>
		</>
	)
}
