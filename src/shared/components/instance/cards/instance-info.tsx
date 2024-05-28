import { Match, Switch, createSignal } from "solid-js";
import configManager, { InstanceData } from "../../../stores/config-manager";
import verifyIP from "../../../utils/ip-verifier";

export default function InstanceInfoCard(props: any) {
	const instance: InstanceData = props.instance;

	const { unselectInstance } = configManager;

	const [networkAddress, setNetworkAddress] = createSignal("");
	const [networkName, setNetworkName] = createSignal("");
	const [subnet, setSubnet] = createSignal("");

	const [existingNetworks, setExistingNetworks] = createSignal({});

	const { addNewNodeAppInstance, setExistingNetworksMap } = configManager;

	setExistingNetworksMap(setExistingNetworks);

	async function addNewNode() {
		if (
			await addNewNodeAppInstance(
				name(),
				networkName(),
				networkAddress(),
				replicas()
			)
		) {
			//reset
			setName("");
			setReplicas(1);
			setNetworkName("");
			setNetworkAddress("");
		}
	}


	return (
		<div class="card w-full bg-primary text-primary-content shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{instance.name}</h2>
				<h5> {instance.type} </h5>
				<Switch fallback={<div />}>
					<Match when={instance.type == "Client" || instance.type == "NodeApp"}>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text text-black">Network Address</span>
							</div>
							<input type="text" placeholder="" value={instance.data?.network_address ?? ""} class="input input-bordered bg-transparent w-full max-w-xs" />
						</label>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text text-black">Network Name</span>
							</div>
							<input type="text" placeholder="" value={instance.data?.network_name ?? ""} class="input input-bordered bg-transparent w-full max-w-xs" />
						</label>
					</Match>
				</Switch>
				<div class="card-actions justify-end">
					<button class="btn btn-secondary" onClick={unselectInstance}>Close</button>
				</div>
			</div>
		</div >
	);
}
