import InstancesModal from "./add-modals/instances-modal";
import NetworksModal from "./networks-modals/networks-modal";

export default function TaskBar(props: any) {
	const config_name = props.config_name;

	return (
		<>
			<div class="absolute top-1/2 left-0 transform -translate-y-1/2 ml-2 join join-vertical">
				<button class="btn btn-primary btn-square join-item" onClick="instances_modal.showModal()">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
				</button>
				<button class="btn btn-primary btn-square join-item" onClick="networks_modal.showModal()">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M220-80q-58 0-99-41t-41-99q0-58 41-99t99-41q18 0 35 4.5t32 12.5l153-153v-110q-44-13-72-49.5T340-740q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-606v110l154 153q15-8 31.5-12.5T740-360q58 0 99 41t41 99q0 58-41 99t-99 41q-58 0-99-41t-41-99q0-18 4.5-35t12.5-32L480-424 343-287q8 15 12.5 32t4.5 35q0 58-41 99t-99 41Zm520-80q25 0 42.5-17.5T800-220q0-25-17.5-42.5T740-280q-25 0-42.5 17.5T680-220q0 25 17.5 42.5T740-160ZM480-680q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680ZM220-160q25 0 42.5-17.5T280-220q0-25-17.5-42.5T220-280q-25 0-42.5 17.5T160-220q0 25 17.5 42.5T220-160Z" /></svg>
				</button>
			</div>

			<InstancesModal config_name={config_name} />
			<NetworksModal config_name={config_name} />
		</>
	);
}
