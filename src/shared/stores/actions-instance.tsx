import { invoke } from "@tauri-apps/api";
import { createRoot, createSignal } from "solid-js";

function createInstanceManagement() {
	const emptyInstance: {
		empty: boolean,
		name: string,
		type: string,
		data: unknown
	} = {
		empty: true,
		name: "",
		type: "",
		data: undefined
	}

	const [selectedInstance, setSelectedInstance] = createSignal(emptyInstance);

	const selectInstance = async (instance: string, config_name: string) => {
		setSelectedInstance(emptyInstance);
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
			(_) => { setSelectedInstance(emptyInstance); }
		);
	}
	const unselectInstance = () => setSelectedInstance(emptyInstance);

	return { selectedInstance, selectInstance, unselectInstance };
}


export default createRoot(createInstanceManagement)
