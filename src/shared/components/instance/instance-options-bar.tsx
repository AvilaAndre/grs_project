import { Show } from "solid-js";
import InstanceInfoCard from "./cards/instance-info";
import configManager from "../../stores/config-manager";
import InstanceStatsCards from "./cards/instance-stats";

export default function InstanceOptionsBar() {
	const { getSelectedInstance } = configManager;

	return (
		<div class="w-fit h-screen flex flex-col justify-start overflow-y-scroll">
			<Show when={!(getSelectedInstance().empty)} >
				<div class="w-[30rem] p-2">
					<InstanceInfoCard instance={getSelectedInstance()} />
				</div>
				<div class="w-[30rem] p-2">
					<InstanceStatsCards instance={getSelectedInstance()} />
				</div>
			</Show>
		</div>
	);
}
