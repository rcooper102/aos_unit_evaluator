import { config } from "../../config.js";

export class BellCurve extends Base {

	constructor() {
		super();
		this.make("bell-curve");
	}

	update(data) {
		this.data = data;
	}

	get chartData() {
		return {
			series: this.series,
			labels: Object.keys(this._labels),
		}
	}

	get series() {
		this._series = [];
		this._labels = [];
		this.data.forEach((unit) => {
			const curve = [];
			Object.keys(unit.curve).forEach((i) => {
				curve.push({
					x: i,
					y: unit.curve[i],
				});
				this._labels[i] = null;
			});
			this._series.push(curve);
		});
		return this._series;
	}
}