import { Show } from "solid-js";
import InstanceInfoCard from "./cards/instance-info";
import instanceManager from "../../stores/actions-instance"

export default function InstanceOptionsBar(props: any) {
	const config_name = props.config_name;
	const { selectedInstance } = instanceManager;

	return (
		<div class="absolute right-0 w-80 h-screen p-4 flex flex-col justify-start">
			<Show when={!(selectedInstance().empty)} >
				<InstanceInfoCard config_name={config_name} instance={selectedInstance()} />
			</Show>
		</div>
	);
}
