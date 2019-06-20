import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class MortalWoundsGraph extends Base {

	constructor() {
		super();
		this.make("mortal-wounds-graph");
		this.addClass("bar-graph");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		let highest = 0;
		data.forEach((item) => {
			highest = item.mortalWounds > highest ? item.mortalWounds : highest;
		});
		const series = data.map((item) => {
			return {
				value: item.mortalWounds,
				color: item.data.color,
				format: (e) => { return Math.round(e*100)/100 },
				scale: highest,
			};
		});
		this.graph = new BarGraph(series, Locale.gen("mortal-wounds-graph-title"), Locale.gen("mortal-wounds-graph-sub-title"))
		this.addChild(this.graph);
	}
}