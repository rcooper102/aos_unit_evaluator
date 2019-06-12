import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class WhiffGraph extends Base {

	constructor() {
		super();
		this.make("whiff-graph");
		this.addClass("bar-graph");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		console.log(data);
		const series = data.map((item) => {
			const zeroes = item.results.filter((item) => item.total === 0);
			return {
				value: zeroes.length / item.results.length,
				color: item.data.color,
				format: Utils.formatPercent,
				scale: 1,
			}
		});
		this.graph = new BarGraph(series, Locale.gen("whiff-graph-title"), Locale.gen("whiff-graph-sub-title"))
		this.addChild(this.graph);
	}
}