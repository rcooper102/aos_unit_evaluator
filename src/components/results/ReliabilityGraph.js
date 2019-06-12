import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class ReliabilityGraph extends Base {

	constructor() {
		super();
		this.make("reliabiliy-graph");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		const series = data.map((item) => {
			const filtered = item.results.filter((attack) => attack.total >= item.average);
			return {
				value: filtered.length / item.results.length,
				color: item.data.color,
				format: Utils.formatPercent,
				scale: 1,
			}
		});
		const graph = new BarGraph(series, Locale.gen("reliabiliy-graph-title"), Locale.gen("reliabiliy-graph-sub-title"))
		this.addChild(graph);
	}
}