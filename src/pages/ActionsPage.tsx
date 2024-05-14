import { A } from "@solidjs/router"
import TaskBar from "../shared/components/actions/taskbar"
import InstanceOptionsBar from "../shared/components/instance/instance-options-bar"
import { Show, createSignal, onMount } from "solid-js";
import configManager from "../shared/stores/config-manager";
import InstanceMap from "../shared/components/actions/instance-map";

export default function ActionsPage(props: any) {
	const config_name = props.params.id;
	const [starting, setStarting] = createSignal(false);
	const [stopping, setStopping] = createSignal(false);

	const { setSelectedConfig, startSelectedConfig, stopSelectedConfig } = configManager;

	async function startConfigDocker() {
		setStarting(true);
		await startSelectedConfig();
		setStarting(false);
	}

	async function stopConfigDocker() {
		setStopping(true);
		await stopSelectedConfig();
		setStopping(false);
	}

	onMount(async () => {
		setSelectedConfig(config_name)
	});

	return (
		<>
			<div class="flex flex-row w-screen">
				<section class="w-full">
					<div class="w-full h-fit grid grid-cols-3 p-2 z-10">
						<A href={"/configs"} class="btn btn-neutral btn-circle">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
							</svg>
						</A>
						<h3 class="text-2xl justify-self-center"> {props.params.id} </h3>
						<div class="join grid grid-cols-2 w-fit justify-self-end">
							<button onClick={startConfigDocker} class="join-item btn btn-square btn-info disabled:bg-info" disabled={starting()}>
								<Show when={starting()} fallback={
									<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-200v-560l440 280-440 280Z" />
									</svg>
								}>
									<span class="animate-spin">
										<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
										</svg>
									</span>
								</Show>
							</button>
							<button onClick={stopConfigDocker} class="join-item btn btn-square btn-error disabled:bg-error" disabled={stopping()}>
								<Show when={stopping()} fallback={
									<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-240v-480h480v480H240Z" />
									</svg>
								}>
									<span class="animate-spin">
										<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
										</svg>
									</span>
								</Show>
							</button>
						</div>
					</div>

					<InstanceMap />
					<TaskBar />
				</section >
				<section class="w-fit">
					<InstanceOptionsBar />
				</section>
			</div >
		</>
	)
}
