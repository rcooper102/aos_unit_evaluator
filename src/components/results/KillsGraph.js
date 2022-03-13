import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class KillsGraph extends Base {

	constructor() {
		super();
		this.make("kills-graph");
		this.addClass("bar-graph");
		this.title = Locale.gen("kills-graph-detail");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}

		const series = data.map((item, i) => {
			return {
				value: item.averageKills,
				color: item.data.color,
				format: (e) => { return Math.round(e*100)/100 },
				name: Utils.generateName(item.data),
				key: i,
			};
		});
		this.graph = new BarGraph(series, Locale.gen("kills-graph-title"), Locale.gen("kills-graph-sub-title"))
		this.addChild(this.graph);
	}
}