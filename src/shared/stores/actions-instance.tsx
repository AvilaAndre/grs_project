import { invoke } from "@tauri-apps/api";
import { createRoot, createSignal } from "solid-js";

function createInstanceManagement() {
	const [selectedInstance, setSelectedInstance] = createSignal({ empty: true });

	const selectInstance = async (instance: string, config_name: string) => {
		await invoke("get_instances", { configName: config_name }).then(
			(res: any) => {
				for (let i = 0; i < res.length; i++) {
					if (res[i][0] === instance) {
						setSelectedInstance({
							name: res[i][0],
							type: Object.keys(res[i][1])[0],
							data: Object.values(res[i][1])[0],
							empty: false
						})
						break
					}
				}
			}
		).catch(
			(_) => { setSelectedInstance({ empty: true }); }
		);
	}
	const unselectInstance = () => setSelectedInstance({ empty: true });

	return { selectedInstance, selectInstance, unselectInstance };
}


export default createRoot(createInstanceManagement)
