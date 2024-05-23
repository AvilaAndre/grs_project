import { createSignal } from "solid-js";
import configManager from "../../../stores/config-manager";
import verifyIP from "../../../utils/ip-verifier";

export default function NetworksModal() {
	const [name, setName] = createSignal("");
	const [subnet, setSubnet] = createSignal("");
	const [gateway, setGateway] = createSignal("");
	const [dnsEndpoint, setDnsEndpoint] = createSignal("");
	const [dnsChecked, setDnsChecked] = createSignal(false);

	const { addNewNetworkToConfig } = configManager;

	async function addNewNetwork() {
		if (
			await addNewNetworkToConfig(
				name(),
				subnet(),
				gateway(),
				dnsEndpoint()
			)
		) {
			//reset
			setName("");
			setSubnet("");
			setGateway("");
			setDnsEndpoint("");
		}
	}

	return (
		<dialog id="networks_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						✕
					</button>
				</form>
				<h3 class="font-bold text-lg mb-5">Networks</h3>

				<div class="flex flex-col gap-y-1">
					<label class="input input-bordered flex items-center gap-2">
						Name
						<input
							type="text"
							value={name()}
							onChange={(e: Event) => {
								// @ts-ignore
								let val = e?.target?.value;
								val = val.trim();
								val = val.replace(" ", "");

								if (val) setName(val);
							}}
							class="grow"
							placeholder="Network1"
						/>
					</label>
					<label class="input input-bordered flex items-center gap-2">
						Subnet
						<input
							type="text"
							value={subnet()}
							onChange={(e: Event) => {
								// @ts-ignore
								let val = e?.target?.value;

								if (val) setSubnet(val);
							}}
							class="grow"
							placeholder="10.0.2.0/24"
						/>
					</label>
					<label class="input input-bordered flex items-center gap-2">
						Gateway
						<input
							type="text"
							value={gateway()}
							onChange={(e: Event) => {
								// @ts-ignore
								let val = e?.target?.value;

								if (val) setGateway(val);
							}}
							class="grow"
							placeholder="10.0.2.1"
						/>
					</label>
					<div class="form-control" id="networksDNSdiv">
						<label class="label cursor-pointer">
							<span class="label-text">
								Connect <span class="font-bold">{name()}</span>{" "}
								network to DNS?
							</span>
							<input
								type="checkbox"
								class="checkbox checkbox-sm"
								id="networksDNSCheckbox"
								onchange={() => {
									let elem =
										document.getElementById(
											"dnsEnpointInput"
										)?.classList;

									let dnsChecked = (
										document.getElementById(
											"networksDNSCheckbox"
										) as HTMLInputElement
									).checked;

									setDnsChecked(dnsChecked);

									if (!dnsChecked) {
										setDnsEndpoint("");
										elem?.replace("flex", "hidden");
									} else {
										elem?.replace("hidden", "flex");
									}
								}}
							/>
						</label>
					</div>
					<label
						class="input input-bordered items-center gap-2 hidden"
						id="dnsEnpointInput"
					>
						Network DNS Endpoint
						<input
							type="text"
							value={dnsEndpoint()}
							onChange={(e: Event) => {
								// @ts-ignore
								let val = e?.target?.value;
								val = val.trim();
								val = val.replace(" ", "");

								setDnsEndpoint(val);

								const elem =
									document.getElementById(
										"dnsEnpointInput"
									)?.classList;

								if (elem) {
									if (!verifyIP(subnet(), dnsEndpoint())) {
										elem.add("input-error");
										elem.remove("input-success");
									} else {
										elem.remove("input-error");
										elem.add("input-success");
									}
								}
							}}
							class="grow"
							placeholder="10.0.2.2"
						/>
					</label>
				</div>
				<div class="modal-action">
					<form method="dialog" onSubmit={addNewNetwork}>
						<button
							class="btn"
							disabled={
								!name().length ||
								!subnet() ||
								!gateway() ||
								!(dnsChecked()
									? subnet() !== "" &&
									  verifyIP(subnet(), dnsEndpoint())
									: true)
							}
						>
							Add Network
						</button>
					</form>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}
