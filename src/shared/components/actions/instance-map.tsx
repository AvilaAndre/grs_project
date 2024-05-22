import { createSignal, onMount, onCleanup, createEffect, For } from "solid-js";
import * as d3 from "d3";
import configManager, { GraphConnection, GraphData } from "../../stores/config-manager";

type graphNode = d3.SimulationNodeDatum & {
	id: string,
	group: number,
	label: number,
	level: number,
}

type graphLink = {
	target: string,
	source: string,
	strength: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
}

export default function InstanceMap() {

	const ticked = () => {
		console.log("ticked")
	}

	const [rect, setRect] = createSignal({
		height: window.innerHeight,
		width: window.innerWidth
	});
	const [simulation, setSimulation] = createSignal(
		d3.forceSimulation()
			.force('link', d3.forceLink()
				.id(link => link.id)
				.strength(link => -10 * link.strength))
			.force('charge', d3.forceManyBody().strength(-100))
			.force('center', d3.forceCenter(rect().width / 2, rect().height / 2))
			.on("tick", ticked)
	)

	const { getGraphData, selectInstance } = configManager;

	let svg: SVGSVGElement;

	const emptyNodeArray: graphNode[] = [];
	const [nodes, setNodes] = createSignal(emptyNodeArray);
	const [nodesUpdated, setNodesUpdated] = createSignal(false);

	const emptyLinkArray: graphLink[] = [];
	const [links, setLinks] = createSignal(emptyLinkArray);

	const emptyNumberArray: number[] = [];
	const [intervalIds, setIntervalIds] = createSignal(emptyNumberArray);

	function getNodeColor(node: graphNode) {
		return node.level === 1 ? 'red' : 'gray'
	}

	const handler = (_event: Event) => {
		setRect({ height: window.innerHeight, width: window.innerWidth });
		setSimulation(simulation().force('center', d3.forceCenter(rect().width / 2, rect().height / 2)))
	};

	onMount(() => {
		window.addEventListener('resize', handler);

		let intervalId = setInterval(() => {
			const { data, connections, changed } = getGraphData();
			if (changed) {
				updateData(data, connections);
				updateGraph();
			}
		}, 1000)

		setIntervalIds([...intervalIds(), intervalId])
	});

	onCleanup(() => {
		window.removeEventListener('resize', handler);
		const ids = intervalIds()
		for (let i = 0; i < ids.length; i++) {
			clearInterval(ids[i]);
		}
	})

	const updateData = (graphData: GraphData[], graphConnections: GraphConnection[]) => {
		const newNodes: graphNode[] = []
		for (let i = 0; i < graphData.length; i++) {
			newNodes.push({ index: graphData[i].id, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null, ...graphData[i] })
		}

		const newLinks: graphLink[] = []
		for (let i = 0; i < graphConnections.length; i++) {
			newLinks.push({ target: graphConnections[i].destination, source: graphConnections[i].source, strength: 5, x1: 0, y1: 0, x2: 0, y2: 0 })
		}

		setNodes(newNodes);
		setNodesUpdated(true);
		setLinks(newLinks);
	}

	const updateGraph = () => {
		let swi_nodes = nodes()
		simulation().nodes(swi_nodes).on('tick', () => {
			if (nodesUpdated())
				return
			setNodes(new Array(...swi_nodes))
		})

		setNodesUpdated(false);

		simulation().force('link');
	}


	createEffect(() => {
		nodes()
		console.log("effect")
		const nodesParent = document.querySelector("#nodes");
		if (nodesParent?.childNodes.length != nodes().length) {
			nodesParent?.replaceChildren();
			for (let i = 0; i < nodes().length; i++) {
				let data = nodes()[i]
				const circle =
					<circle id={data.id} r="15" fill={getNodeColor(data)} cx={(data.x ?? 0)} cy={(data.y ?? 0)}
						class="cursor-pointer" onClick={() => selectInstance(data.id)}>
						<title>{data.id}</title>
					</circle>

				// @ts-ignore
				nodesParent?.appendChild(circle);
			}
		} else {
			for (let i = 0; i < nodes().length; i++) {
				let selectedNode = document.querySelector(`#nodes > #${nodes()[i].id}`)
				selectedNode?.setAttribute("cx", nodes()[i].x?.toString() ?? "0")
				selectedNode?.setAttribute("cy", nodes()[i].y?.toString() ?? "0")
			}
		}
		for (let i = 0; i < links().length; i++) {
			let selectedNode = document.querySelector(`#links > #${links()[i].source}-${links()[i].target}`)
			let sourceNode = document.querySelector(`#nodes> #${links()[i].source}`)
			let targetNode = document.querySelector(`#nodes> #${links()[i].target}`)
			selectedNode?.setAttribute("x1", sourceNode?.getAttribute("cx") ?? "0")
			selectedNode?.setAttribute("y1", sourceNode?.getAttribute("cy") ?? "0")
			selectedNode?.setAttribute("x2", targetNode?.getAttribute("cx") ?? "0")
			selectedNode?.setAttribute("y2", targetNode?.getAttribute("cy") ?? "0")
		}
	})

	return (
		<>
			<svg ref={svg} width={rect().width} height={rect().height} class="absolute top-0 left-0 z-0" >
				<g id="links" stroke="currentColor" stroke-opacity="0.5">
					<For each={links()} fallback={<></>}>{(data: graphLink) =>
						<line id={data.source + "-" + data.target} stroke-width={data.strength} class="stroke-primary"
							x1={(data.x1 ?? 0)} y1={(data.y1 ?? 0)}
							x2={(data.x2 ?? 0)} y2={(data.y2 ?? 0)}
						/>
					}</For>
				</g>
				<g id="nodes" stroke="currentColor" stroke-width="1.5" />
			</svg>
		</>
	);
}
