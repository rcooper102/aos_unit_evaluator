import { config } from "../../config.js";
import { SaveLevelSimulator } from "./SaveLevelSimulator.js";

export class Simulator extends EventDispatcher {

	constructor(data, iterations) {
		super();
		this.config = config.simulator;
		this.data = data;
		this.results = {};
		this.completed = 0;
		this.config.saves.forEach((item) => {
			const save = new SaveLevelSimulator(data, item, iterations);
			save.addListener(Event.COMPLETE, this.onComplete, this);
		});
	}

	onComplete(e) {
		this.completed ++;
		this.results[e.target.save] = e.target.results;
		if(this.completed === this.config.saves.length) {
			this.dispatch(new Event(Event.COMPLETE, this.results));
		}
	}

}