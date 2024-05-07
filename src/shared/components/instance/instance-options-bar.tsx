import { Show, onMount } from "solid-js";
import InstanceInfoCard from "./cards/instance-info";
import configManager from "../../stores/config-manager";

export default function InstanceOptionsBar(props: any) {
	const config_name = props.config_name;
	const { getSelectedInstance, setSelectedConfig } = configManager;

	onMount(async () => {
		setSelectedConfig(config_name)
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
