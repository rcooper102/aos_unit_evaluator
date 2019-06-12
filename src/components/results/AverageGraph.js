import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class AverageGraph extends Base {

	constructor() {
		super();
		this.make("average-graph");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		const series = data.map((item) => {
			return {
				value: item.average,
				color: item.data.color,
				format: (e) => { return Math.round(e*100)/100 },
			}
		});
		const graph = new BarGraph(series, Locale.gen("average-graph-title"), Locale.gen("average-graph-sub-title"))
		this.addChild(graph);
	}
}