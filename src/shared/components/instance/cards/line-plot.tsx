import { For, createEffect, createSignal, onMount } from "solid-js";
import { DockerStats } from "../../../stores/config-manager";
import * as d3 from "d3";

export default function LinePlot(props: any) {
	const { title, method, dataType } = props;

	const [plotTitle, setPlotTitle] = createSignal(title);
	const [width, setWidth] = createSignal(322);
	const [height, setHeight] = createSignal(161);
	const emptyPlotData: number[][] = [];
	const [plotData, setPlotData] = createSignal(emptyPlotData);
	const marginTop = 5;
	const marginRight = 10;
	const marginBottom = 5;
	const marginLeft = 30;

	let x = d3.scaleLinear(
		[0, 49],
		[marginLeft, width() - marginRight]
	);
	// @ts-ignore
	let y = d3.scaleLinear(d3.extent(plotData()), [height() - marginBottom, marginTop]);
	let line = d3.line((_d, i) => x(i), y);

	createEffect(() => {
		let dataArray: number[][] = [];
		props.data.map((data: DockerStats[]) => dataArray.push(data.map((stats: DockerStats) => method(stats))));

		setPlotData(dataArray)

		let dataToExtent = plotData().reduce((acc, val) => acc.concat(val), []);
		dataToExtent = dataToExtent.concat([0, 0.3]);

		let extent: [number, number] = d3.extent(dataToExtent) as [number, number];
		extent[0] = 0;
		extent[1] = Math.max(extent[1] + extent[1] * 0.33, 0.5);

		// when the data is too big
		let divider = 1;
		let dataTypeLabel = "";

		if (dataType == "%") {
			dataTypeLabel = "(%)"
		} else if (dataType == "bytes") {
			if (extent[1] > 1000000000) {
				divider = 1000000000;
				dataTypeLabel = "(GB)"
			} else if (extent[1] > 1000000) {
				divider = 1000000;
				dataTypeLabel = "(MB)"
			} else if (extent[1] > 1000) {
				divider = 1000;
				dataTypeLabel = "(KB)"
			} else
				dataTypeLabel = "(B)"
		} else if (dataType == "bits") {
			if (extent[1] > 8589934592) {
				divider = 8589934592;
				dataTypeLabel = "(GiB)"
			} else if (extent[1] > 8388608) {
				divider = 8388608;
				dataTypeLabel = "(MiB)"
			} else if (extent[1] > 1024) {
				divider = 1024;
				dataTypeLabel = "(KiB)"
			} else
				dataTypeLabel = "(B)"
		}

		setPlotTitle(title + " " + dataTypeLabel);

		if (plotData().length > 0) {
			x = d3.scaleLinear(
				[0, 49],
				[marginLeft, width() - marginRight]
			);
			// @ts-ignore
			y = d3.scaleLinear(extent, [height() - marginBottom, marginTop]);
			let lineY = d3.scaleLinear([0, extent[1] / divider], [height() - marginBottom, marginTop]);
			line = d3.line((_d, i) => x(i), y);

			d3.select(gy).call(d3.axisLeft(lineY));
		}
	});

	onMount(async () => {
		if (frameDiv?.clientWidth) {
			setWidth(frameDiv?.clientWidth);
			setHeight(width() / 2);
		}
	});

	const colors = ["red", "teal", "green", "blue", "purple"];

	const getColor = (i: number) => {
		return colors[i % colors.length];
	}

	let frameDiv: HTMLDivElement;

	let gy: SVGGElement;

	return (
		<div class="collapse collapse-arrow bg-base-200">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">
				{plotTitle()}
			</div>
			<div class="collapse-content">
				<div ref={frameDiv} class="w-full h-full">
					<svg width={width()} height={height()} >
						<g ref={gy} class="stroke-black dark:stroke-white" transform={`translate(${marginLeft},0)`} />
						<For each={plotData()} fallback={<div />}>{(dockerStatsData, i) =>
							<>
								<path
									fill="none"
									stroke={getColor(i())}
									stroke-width="1.5"
									d={line(dockerStatsData)}
								/>
								<g fill={getColor(i())} stroke="currentColor" stroke-width="1.5">
									{dockerStatsData.map((d, i) => (
										<circle cx={x(i)} cy={y(d)} r="2.5" />
									))}
								</g>
							</>
						}</For>
					</svg>
				</div>
			</div>
		</div>
	);
}
