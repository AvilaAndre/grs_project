import { For } from "solid-js"
import configManager, { InstanceData, InstanceTypes } from "../../../stores/config-manager";

export default function InstancesListModal() {
	const { getInstancesList, selectInstance } = configManager;

	return (
		<dialog id="instances_list_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
				</form>
				<h3 class="font-bold text-lg mb-5">Instances</h3>
				<ul class="menu w-full rounded-box">
					<li>
						<For each={InstanceTypes} fallback={<div />}>{instanceType =>
							<details>
								<summary>{instanceType}</summary>
								<form method="dialog">
									<ul>
										<For each={getInstancesList().filter((inst: InstanceData) => inst.type == instanceType).map((inst: InstanceData) => inst.name)} fallback={<p>No instances found</p>}>{(inst_name: String, _: any) =>
											<li><button onClick={() => selectInstance(inst_name.toString())}>{inst_name.toString()}</button></li>
										}</For>
									</ul>
								</form>
							</details>
						}</For>
					</li>
				</ul>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog >
	);
}

