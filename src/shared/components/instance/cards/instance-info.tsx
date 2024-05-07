import { Match, Switch } from "solid-js";
import configManager from "../../../stores/config-manager";

export default function InstanceInfoCard(props: any) {
	const instance = props.instance;

	const { unselectInstance } = configManager;

	return (
		<div class="card w-full bg-primary text-primary-content shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{instance.name}</h2>
				<h5> {instance.type} </h5>
				<Switch fallback={<div />}>
					<Match when={instance.type == "NodeApp"}>
						NodeApp
					</Match>
					<Match when={instance.type == "Client"}>
						Client
					</Match>
				</Switch>
				<div class="card-actions justify-end">
					<button class="btn btn-secondary" onClick={unselectInstance}>Close</button>
				</div>
			</div>
		</div >
	);
}
