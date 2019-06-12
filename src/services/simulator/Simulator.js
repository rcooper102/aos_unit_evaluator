import { config } from "../../config.js";
import { SaveLevelSimulator } from "./SaveLevelSimulator.js";

export class Simulator extends EventDispatcher {

	constructor(data, iterations) {
		super();
		this.config = config.simulator;
		this.data = data;
		this.results = {};
		this.completed = 0;
		this.progress = {};
		this.config.saves.forEach((item) => {
			const save = new SaveLevelSimulator(data, item, iterations);
			save.addListener(Event.COMPLETE, this.onComplete, this);
			save.addListener(Event.PROGRESS, this.onProgress, this);
			this.progress[item] = 0;
		});
	}

	onProgress(e) {
		this.progress[e.target.save] = e.target.progress;
		let total = 0
		Object.keys(this.progress).forEach((i) => {
			total += this.progress[i];
		});
		this.dispatch(new Event(Event.PROGRESS, total/Object.keys(this.progress).length));
	}

	onComplete(e) {
		this.completed ++;
		this.results[e.target.save] = e.target.results;
		if(this.completed === this.config.saves.length) {
			this.dispatch(new Event(Event.COMPLETE, this.results));
		}
	}

}