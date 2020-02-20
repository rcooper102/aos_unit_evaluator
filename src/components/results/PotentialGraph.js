import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class PotentialGraph extends Base {

	constructor() {
		super();
		this.make("potential-graph");
		this.addClass("bar-graph");
		this.title = Locale.gen("potential-graph-detail");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		let highest = 0;
		data.forEach((item) => {
			highest = item.highestDamage > highest ? item.highestDamage : highest;
		});
		const series = data.map((item, i) => {
			return {
				value: item.highestDamage,
				color: item.data.color,
				format: (e) => { return Math.round(e*100)/100 },
				scale: highest,
				name: item.data.name,
				key: i,
			};
		});
		this.graph = new BarGraph(series, Locale.gen("potential-graph-title"), Locale.gen("potential-graph-sub-title"))
		this.addChild(this.graph);
	}
}