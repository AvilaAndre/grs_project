import { For, createSignal, onCleanup, onMount } from "solid-js";
import configManager, { DockerStats, InstanceData } from "../../../stores/config-manager";
import LinePlot from "./line-plot";

export default function InstanceStatsCards(props: any) {
	const instance: InstanceData = props.instance;

	const [gettingStats, setGettingStats] = createSignal(false);
	const emptyDockerStats: DockerStats[][] = []
	const [stats, setStats] = createSignal(emptyDockerStats);

	const { getContainerStats } = configManager;

	const updateStats = async () => {
		if (gettingStats()) {
			setTimeout(updateStats, 1000);
			setStats(await getContainerStats(instance.name))
		}
	}
	onMount(async () => {
		if (!gettingStats()) {
			setGettingStats(true);
			updateStats();
		}
	});

	onCleanup(() => {
		setGettingStats(false);
	})

	const suffixes: { [suffix: string]: number } = {
		"kB": 1000,
		"kiB": 1024,
		"MB": 1000000,
		"MiB": 8388608,
		"GB": 1000000000,
		"GiB": 8589934592,
	}

	const extractValue = (valString: string): number => {
		let val: number = parseFloat(valString)
		const suffix: string = valString.replace(String(val), "").trim();
		if (suffix in suffixes) {
			let multiplier: number = suffixes[suffix] ?? 1;
			val = val * multiplier
		}

		return val
	}

	const getCPUPerc = (docker: DockerStats): number => parseFloat(docker.CPUPerc)
	const getMemPerc = (docker: DockerStats): number => parseFloat(docker.MemPerc)
	const getMemoryUsage = (docker: DockerStats): number => extractValue(docker.MemUsage.slice(0, docker.MemUsage.search('/') - 1))
	const getNetI = (docker: DockerStats): number => extractValue(docker.NetIO.slice(0, docker.NetIO.search('/') - 1))
	const getNetO = (docker: DockerStats): number => extractValue(docker.NetIO.slice(docker.NetIO.search('/') + 1))
	const getBlockI = (docker: DockerStats): number => extractValue(docker.BlockIO.slice(0, docker.BlockIO.search('/') - 1))
	const getBlockO = (docker: DockerStats): number => extractValue(docker.BlockIO.slice(docker.BlockIO.search('/') + 1))

	const graphs = [
		{ title: "CPU Percentage", method: getCPUPerc, dataType: "%" },
		{ title: "Memory Percentage", method: getMemPerc, dataType: "%" },
		{ title: "MemoryUsage", method: getMemoryUsage, dataType: "bits" },
		{ title: "Network Input", method: getNetI, dataType: "bytes" },
		{ title: "Network Output", method: getNetO, dataType: "bytes" },
		{ title: "Block Input", method: getBlockI, dataType: "bytes" },
		{ title: "Block Output", method: getBlockO, dataType: "bytes" },
	];

	return (
		<div>
			<For each={graphs} fallback={<div />}>{statMethod =>
				<LinePlot title={statMethod.title} method={statMethod.method} dataType={statMethod.dataType} data={stats()} />
			}</For>
		</div>
	);
}
