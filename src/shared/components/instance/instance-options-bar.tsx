import { Show, createSignal, onCleanup, onMount } from "solid-js";
import InstanceInfoCard from "./cards/instance-info";
import configManager from "../../stores/config-manager";

export default function InstanceOptionsBar() {
	const { getSelectedInstance } = configManager;
	const [gettingStats, setGettingStats] = createSignal(false);

	const { getContainerStats } = configManager;

	onMount(async () => {
		if (!gettingStats()) {
			setGettingStats(true);
			setInterval(() => { if (gettingStats()) getContainerStats() }, 1000);
		}
	});

	onCleanup(() => {
		setGettingStats(false);
	})

	return (
		<div class="w-fit h-screen flex flex-col justify-start">
			<Show when={!(getSelectedInstance().empty)} >
				<div class="w-80 p-4">
					<InstanceInfoCard instance={getSelectedInstance()} />
				</div>
			</Show>
		</div>
	);
}
