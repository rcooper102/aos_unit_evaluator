import { BarGraph } from "./BarGraph.js";
import { Utils } from "../../utils";

export class DependabilityGraph extends Base {

	constructor() {
		super();
		this.make("dependability-graph");
		this.addClass("bar-graph");
		this.title = Locale.gen("dependability-graph-detail");
	}

	update(data) {
		if(this.graph) {
			this.graph.shutDown();
		}
		let highest = 0;
		data.forEach((item) => {
			highest = item.highestDamage > highest ? item.highestDamage : highest;
		});

		const series = data.map((item) => {
			let top = [...item.results.sort((a,b) => a.total - b.total)];
			top.splice(0,Math.floor(top.length*0.05));
			top = top.filter((item) => item.total > 0)
			const threshold = top[0].total;

			let out = item.results.filter((attack) => attack.total >= threshold);

			return {
				value: threshold,
				inner: 1-(out.length / item.results.length),
				color: item.data.color,
				format: (e) => { return `${e} <span>(${Utils.formatPercent(out.length / item.results.length)})</span>` },
				scale: threshold,
			};
		});
		this.graph = new BarGraph(series, Locale.gen("dependability-graph-title"), Locale.gen("dependability-graph-sub-title"))
		this.addChild(this.graph);
	}
}