import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";

export default function NetworksModal(props: any) {
	const [name, setName] = createSignal("");
	const [subnet, setSubnet] = createSignal("");
	const [gateway, setGateway] = createSignal("");

	const config_name = props.config_name;

	async function addNewNetwork() {
		await invoke("add_network_to_config", {
			configName: config_name,
			networkName: name(),
			subnet: subnet(),
			gateway: gateway(),
		});
	}

	return (
		<dialog id="networks_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
				</form>
				<h3 class="font-bold text-lg mb-5">Networks</h3>

				<div class="flex flex-col gap-y-1">
					<label class="input input-bordered flex items-center gap-2">
						Name
						<input type="text" value={name()} onChange={(e: Event) => {
							// @ts-ignore
							let val = e?.target?.value

							if (val)
								setName(val)
						}
						} class="grow" placeholder="Network1" />
					</label>
					<label class="input input-bordered flex items-center gap-2">
						Subnet
						<input type="text" value={subnet()} onChange={(e: Event) => {
							// @ts-ignore
							let val = e?.target?.value

							if (val)
								setSubnet(val)
						}
						} class="grow" placeholder="10.0.2.0/24" />
					</label>
					<label class="input input-bordered flex items-center gap-2">
						Gateway
						<input type="text" value={gateway()} onChange={(e: Event) => {
							// @ts-ignore
							let val = e?.target?.value

							if (val)
								setGateway(val)
						}
						} class="grow" placeholder="10.0.2.1" />
					</label>
				</div>
				<div class="modal-action">
					<form method="dialog" onSubmit={addNewNetwork}>
						<button class="btn">Add Network</button>
					</form>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}

