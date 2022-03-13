import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class AverageGraph extends Base {

	constructor() {
		super();
		this.make("average-graph");
		this.addClass("bar-graph");
		this.title = Locale.gen("average-graph-detail");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		
		const series = data.map((item, i) => {
			return {
				value: item.average,
				inner: item.mortalWounds,
				color: item.data.color,
				format: (e) => { return Math.round(e*100)/100 },
				name: Utils.generateName(item.data),
				key: i,
			};
		});
		this.graph = new BarGraph(series, Locale.gen("average-graph-title"), Locale.gen("average-graph-sub-title"))
		this.addChild(this.graph);
	}
}