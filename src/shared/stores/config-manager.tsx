import { invoke } from "@tauri-apps/api";
import { createRoot, createSignal } from "solid-js";
import toast from "solid-toast";

export type DockerStats = {
	BlockIO: string,
	CPUPerc: string,
	ID: string,
	MemPerc: string,
	MemUsage: string,
	Name: string,
	NetIO: string,
};

export type InstanceData = {
	empty: boolean;
	name: string;
	type: string;
	data: unknown;
	stats: DockerStats[];
};

export type GraphData = {
	id: string;
	label: string;
	type: string;
}

export const InstanceTypes = ["NodeApp", "Client", "Nginx", "Router"];

const emptyGraphDataList: GraphData[] = [];

const emptyInstanceList: InstanceData[] = [];
const emptyInstance: InstanceData = {
	empty: true,
	name: "",
	type: "",
	data: undefined,
	stats: [],
};

function createConfigManager() {
	const [configsList, setConfigsList] = createSignal([]);
	const [configName, setConfigName] = createSignal("");
	const [instances, setInstances] = createSignal(emptyInstanceList);
	const [selectedInstance, setSelectedInstance] = createSignal(emptyInstance);
	const [graphData, setGraphData] = createSignal(emptyGraphDataList);
	const [graphDataChanged, setGraphDataChanged] = createSignal(false);

	let instancesUpdateNum = 0;

	const getConfigsList = async () => {
		setConfigsList(await invoke("get_configs", {}));
		return configsList();
	};

	const createNewConfig = async (newConfigName: string) => {
		if (
			configsList().reduce(
				(acc, value) => acc || value === newConfigName,
				false
			)
		) {
			toast.error("A configuration file with that name already exists");
			return;
		}
		let response = await invoke("create_compose_config", {
			name: newConfigName,
		})
			.then((list) => list)
			.catch((error) => error);

		if (typeof response == "string") {
			toast.error(response);
		} else {
			// response will be an array, but typescript sees it as unknown
			// @ts-ignore
			setConfigsList(response);
		}
	};

	const getSelectedConfig = (): string => {
		return configName();
	};

	const setSelectedConfig = (configName: string) => {
		setConfigName(configName);
		setGraphData(emptyGraphDataList);
		setGraphDataChanged(true);
		updateConfig();
	};

	const updateConfig = async () => {
		await fetchInstancesList();
	};

	const fetchInstancesList = async () => {
		let instances_fetched: any[] = await invoke("get_instances", {
			configName: configName(),
		});

		let instances_parsed: InstanceData[] = instances_fetched.map(
			(inst: any) => {
				let parsed_inst: InstanceData = {
					name: inst[0],
					type: Object.keys(inst[1])[0],
					data: Object.values(inst[1])[0],
					empty: false,
					stats: [],
				};

				return parsed_inst;
			}
		);

		setInstancesWrapper(instances_parsed);
	};

	const setInstancesWrapper = (insts: InstanceData[]) => {
		instancesUpdateNum = Math.random();
		setInstances(insts);
		const newGraphData: GraphData[] = [];
		for (let i = 0; i < instances().length; i++) {
			let instance = instances()[i];
			if (instance.data?.replicas) {
				for (let j = 1; j <= instance.data?.replicas; j++) {
					newGraphData.push({ id: instance.name + "-" + j, label: instance.name, type: instance.type })
				}
			} else {
				newGraphData.push({ id: instance.name, label: instance.name, type: instance.type })
			}
		}
		setGraphData(newGraphData);
		setGraphDataChanged(true);

		console.log("graphDataSet", newGraphData)
	};

	const getInstancesList = (): InstanceData[] => {
		return instances();
	};

	const selectInstance = async (instance: string) => {
		setSelectedInstance(emptyInstance);
		await invoke("get_instances", { configName: configName() })
			.then((res: any) => {
				for (let i = 0; i < res.length; i++) {
					if (res[i][0] === instance) {
						setSelectedInstance({
							name: res[i][0],
							type: Object.keys(res[i][1])[0],
							data: Object.values(res[i][1])[0],
							empty: false,
							stats: [],
						});
						break;
					}
				}
			})
			.catch((_) => {
				setSelectedInstance(emptyInstance);
			});
	};
	const unselectInstance = () => setSelectedInstance(emptyInstance);

	const getSelectedInstance = () => selectedInstance();

	const addNewClientInstance = async (
		instanceName: string,
		networkAddress: string,
		networkName: string,
		replicas: number
	): Promise<boolean> => {
		let result = await invoke("add_client_instance_to_config", {
			configName: configName(),
			instanceName,
			networkAddress,
			networkName,
			replicas,
		})
			.then((add) => {
				if (!add)
					toast.error(
						instanceName + " Client instance could not be created."
					);
				else {
					toast.success(instanceName + " Client instance created.");
					return true;
				}
				return false;
			})
			.catch((error) => {
				toast.error(error);
				return false;
			});

		await updateConfig();
		return result;
	};

	const addNewNodeAppInstance = async (
		instanceName: string,
		networkName: string,
		networkAddress: string,
		replicas: number
	): Promise<boolean> => {
		let result = await invoke("add_nodeapp_instance_to_config", {
			configName: configName(),
			instanceName,
			networkName,
			networkAddress,
			replicas,
		})
			.then((add) => {
				if (!add)
					toast.error(
						instanceName +
						" Node App instance could not be created."
					);
				else {
					toast.success(instanceName + " Node App instance created.");
					return true;
				}
				return false;
			})
			.catch((error) => {
				toast.error(error);
				return false;
			});

		await updateConfig();
		return result;
	};

	const addNewNginxInstance = async (
		instanceName: string,
		memoryLimit: string,
		cpusLimit: string,
		memoryReservations: string,
		networkAddress: string,
		networkName: string,
	): Promise<boolean> => {
		let result = await invoke("add_nginx_instance_to_config", {
			configName: configName(),
			instanceName,
			memoryLimit,
			cpusLimit,
			memoryReservations,
			networkAddress,
			networkName
		})
			.then((add) => {
				if (!add)
					toast.error(
						instanceName + " Nginx instance could not be created."
					);
				else {
					toast.success(instanceName + " Nginx instance created.");
					return true;
				}
				return false;
			})
			.catch((error) => {
				toast.error(error);
				return false;
			});

		await updateConfig();
		return result;
	};

	const addNewRouterInstance = async (
		instanceName: string,
		networkAddress: string,
		networkName: string
	): Promise<boolean> => {
		let result = await invoke("add_router_instance_to_config", {
			configName: configName(),
			instanceName,
			networkAddress,
			networkName
		})
			.then((add) => {
				if (!add)
					toast.error(
						instanceName + " Router instance could not be created."
					);
				else {
					toast.success(instanceName + " Router instance created.");
					return true;
				}
				return false;
			})
			.catch((error) => {
				toast.error(error);
				return false;
			});

		await updateConfig();
		return result;
	};

	const addNewNetworkToConfig = async (
		networkName: string,
		subnet: string,
		gateway: string
	): Promise<boolean> => {
		let result = await invoke("add_network_to_config", {
			configName: configName(),
			networkName,
			subnet,
			gateway,
		})
			.then((add) => {
				if (!add)
					toast.error(networkName + " network could not be created.");
				else {
					toast.success(networkName + " network created.");
					return true;
				}
				return false;
			})
			.catch((error) => {
				toast.error(error);
				return false;
			});

		await updateConfig();
		return result;
	};

	const getContainerStats = async (instanceName: string): Promise<DockerStats[][]> => {
		try {
			let result: DockerStats[][] = await invoke("get_container_stats", {
				instanceName: instanceName,
			});

			return result
		} catch (err) {
			console.error("Stats fetch failed:", err);
			return [];
		}
	};

	const getExistingNetworks = async () => {
		try {
			let result: any[] = await invoke("get_existing_networks", {
				configName: configName(),
			});

			return result;
		} catch (err) {
			console.log("Stats fetch failed:", err);
		}
	};

	const setExistingNetworksMap = async (setExistingNetworks: any) => {
		try {
			const result: any = await getExistingNetworks();
			setExistingNetworks(result);
			return true;
		} catch (error) {
			console.error("Error fetching existing networks:", error);
			setExistingNetworks(new Map());
			return false;
		}
	};

	const startSelectedConfig = async () => {
		await invoke("start_config_docker", { configName: configName() })
			.then(() => {
				toast.success("This configuration's docker compose started.");
			})
			.catch((error) => {
				toast.error(error);
			});
	};

	const getGraphData = (): { data: GraphData[], changed: boolean } => {
		const changed = graphDataChanged();
		setGraphDataChanged(false);
		return { data: graphData(), changed };
	}

	const stopSelectedConfig = async () => {
		await invoke("stop_config_docker", { configName: configName() })
			.then(() => {
				toast.success("This configuration's docker compose stopped.");
			})
			.catch((error) => {
				toast.error(error);
			});
	};

	return {
		getConfigsList,
		createNewConfig,
		getSelectedConfig,
		setSelectedConfig,
		getInstancesList,
		unselectInstance,
		selectInstance,
		getSelectedInstance,
		addNewNodeAppInstance,
		addNewClientInstance,
		addNewNginxInstance,
		addNewRouterInstance,
		addNewNetworkToConfig,
		getContainerStats,
		getExistingNetworks,
		setExistingNetworksMap,
		startSelectedConfig,
		stopSelectedConfig,
		getGraphData,
	};
}

export default createRoot(createConfigManager);
