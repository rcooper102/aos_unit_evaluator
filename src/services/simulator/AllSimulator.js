import { config } from "../../config.js";
import { SaveLevelSimulator } from "./SaveLevelSimulator.js";
import { Utils } from "../../utils";
const cloneDeep = require('clone-deep');

export class AllSimulator extends EventDispatcher {

	constructor() {
		super();
		Utils.resetRollCount();
		this.config = config.simulator;
		this.results = {};
		this.completed = 0;
		this.progress = {};
		this.highest = 0;


		this.units = window.sim.localSaves;
		
		const data = this.units.map((item) => {
			return JSON.parse(localStorage[window.sim.generateLocalName(item)]);
		}).filter(item => !!item.points);

		const save = new SaveLevelSimulator(data, config['all-sim'].save, config['all-sim'].iterations);
		save.addListener(Event.COMPLETE, this.onComplete, this);
		save.addListener(Event.PROGRESS, this.onProgress, this);
	}



	onProgress(e) {
		this.dispatch(new Event(Event.PROGRESS, e.target.progress));
	}

	onComplete(e) {
		const results = e.target.results.map((item) => {
			const ratio = config['all-sim'].normalize / Number(item.data.points)
			return {
				ratio: ratio,
				average: item.average,
				normalized: item.average * ratio,
				points: Number(item.data.points),
				data: item.data,
			};
		});
		this.dispatch(new Event(Event.COMPLETE, { results: results }));
	}

}