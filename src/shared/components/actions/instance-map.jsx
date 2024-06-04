import * as d3 from "d3";
import { createSignal, onCleanup, onMount } from "solid-js";
import configManager from "../../stores/config-manager";

export default function InstanceMap() {
	const [intervalIds, setIntervalIds] = createSignal([]);

	const { getGraphData, selectInstance } = configManager;

	// Specify the dimensions of the chart.
	const width = 928;
	const height = 680;

	// Specify the color scale.
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// The force simulation mutates links and nodes, so create a copy
	// so that re-evaluating this cell produces the same result.
	const links = []
	const nodes = []

	// Create a simulation with several forces.
	let simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.id))
		.force("charge", d3.forceManyBody())
		.force("x", d3.forceX())
		.force("y", d3.forceY());

	// Create the SVG container.
	const svg = d3.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [-width / 2, -height / 2, width, height])
		.attr("class", "absolute top-0 left-0 z-0");

	// Add a line for each link, and a circle for each node.
	let link = svg.append("g")
		.attr("id", "links")
		.attr("stroke", "#999")
		.attr("stroke-opacity", 0.6)
		.selectAll("line")
		.data(links)
		.join("line")
		.attr("stroke-width", d => Math.sqrt(d.value));

	let node = svg.append("g")
		.attr("id", "nodes")
		.attr("stroke", "#fff")
		.attr("stroke-width", 1.5)
		.selectAll("circle")
		.data(nodes)
		.join("circle")
		.attr("r", 5)
		.attr("fill", d => color(d.group));

	node.append("title")
		.text(d => d.id);

	// Add a drag behavior.
	node.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));

	let pivot = svg.append("g")
		.attr("id", "draggable")
		.append("circle")
		.attr("r", 5)
		.attr("opacity", 0.6)
		.attr("fill", _d => color(0));

	// Add a drag behavior.
	pivot.call(d3.drag()
		.on("start", pivotdrag)
		.on("drag", pivotdrag)
		.on("end", pivotdragend));

	// Set the position attributes of links and nodes each time the simulation ticks.
	simulation.on("tick", () => {
		link
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);

		node
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);
	});

	// Reheat the simulation when drag starts, and fix the subject position.
	function dragstarted(event) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.subject.x;
		event.subject.fy = event.subject.y;
	}

	// Update the subject (dragged node) position during drag.
	function dragged(event) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	// Restore the target alpha so the simulation cools after dragging ends.
	// Unfix the subject position now that it’s no longer being dragged.
	function dragended(event) {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	}

	function pivotdrag(event) {
		pivot.attr("cx", event.x)
		pivot.attr("cy", event.y)
		simulation.force("x", d3.forceX(pivot.attr("cx")))
			.force("y", d3.forceY(pivot.attr("cy")));

		simulation.alphaTarget(0.3).restart()
	}

	function pivotdragend(event) {
		pivot.attr("cx", event.x)
		pivot.attr("cy", event.y)
		simulation.force("x", d3.forceX(pivot.attr("cx")))
			.force("y", d3.forceY(pivot.attr("cy")));

		if (!event.active) simulation.alphaTarget(0);
	}

	const updateData = (graphData, graphConnections) => {
		const nodes = graphData;
		const links = graphConnections;

		simulation.stop();
		try {
			simulation = d3.forceSimulation(nodes)
				.force("link", d3.forceLink(links).id(d => d.id))
				.force("charge", d3.forceManyBody().strength(-120))
				.force("x", d3.forceX(pivot.attr("cx")))
				.force("y", d3.forceY(pivot.attr("cy")));
		} catch (_e) { }

		updateNodes(nodes);
		updateLinks(links)

		simulation.restart()
		simulation.on("tick", () => {
			link
				.attr("x1", d => d.source.x)
				.attr("y1", d => d.source.y)
				.attr("x2", d => d.target.x)
				.attr("y2", d => d.target.y);

			node
				.attr("cx", d => d.x)
				.attr("cy", d => d.y);
		});
	}

	const updateNodes = (nodes) => {
		node = svg.select("g#nodes")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 15)
			.attr("fill", d => color(d.group)) // TODO: Type
			// .attr("stroke", d => color(group)) // TODO: Type
			.attr("data-id", d => d.id)
			.on("click", (event) => selectInstance(event.target.getAttribute("data-id")));

		node.append("title")
			.text(d => d.id);

		// Add a drag behavior.
		node.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));
	}

	const updateLinks = (links) => {
		link = svg.select("g#links")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke-width", _d => 3);
	}

	const resize = (_event) => {
		svg
			.attr("width", window.innerWidth)
			.attr("height", window.innerHeight)
	};

	onMount(() => {
		window.addEventListener('resize', resize);
		resize()

		let intervalId = setInterval(() => {
			const { data, connections, changed } = getGraphData();
			if (changed) {
				updateData(data, connections);
			}
		}, 1000)

		setIntervalIds([...intervalIds(), intervalId])
	});

	onCleanup(() => {
		window.removeEventListener('resize', resize);
		const ids = intervalIds()
		for (let i = 0; i < ids.length; i++) {
			clearInterval(ids[i]);
		}

		simulation.stop()
	})


	return (
		<>
			{svg.node()}
		</>
	);
}
