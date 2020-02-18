import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class WhiffGraph extends Base {

	constructor() {
		super();
		this.make("whiff-graph");
		this.addClass("bar-graph");
		this.title = Locale.gen("whiff-graph-detail");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		const series = data.map((item, i) => {
			const zeroes = item.results.filter((item) => item.total === 0);
			return {
				value: zeroes.length / item.results.length,
				color: item.data.color,
				format: Utils.formatPercent,
				scale: 1,
				name: item.data.name,
				key: i,
			}
		});
		this.graph = new BarGraph(series, Locale.gen("whiff-graph-title"), Locale.gen("whiff-graph-sub-title"))
		this.addChild(this.graph);
	}
}