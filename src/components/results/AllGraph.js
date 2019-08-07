import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";
import { config } from "../../config";

export class AllGraph extends Base {

	constructor() {
		super();
		this.make("all-graph");
		this.addClass("bar-graph");
	}

	update(data) {
		let highest = 0;
		data.forEach((item) => {
			if(item.normalized > highest) {
				highest = item.normalized;
			}
		});
		const sorted = data.sort((a,b) => a.normalized < b.normalized ? 1 : -1);
		if(this.graph) {
			this.graph.shutDown();
		}
		const series = data.map((item) => {
			return {
				value: item.normalized,
				color: item.data.color,
				format: () => `${item.data.name} - ${ Number(Math.round(item.score * 10)/10).toFixed(1) }`,
				scale: highest,
			}
		});
		this.graph = new BarGraph(series, Locale.gen("all-graph-title"), Locale.gen("all-graph-sub-title"))
		this.addChild(this.graph);
	}
}