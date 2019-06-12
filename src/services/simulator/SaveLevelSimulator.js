import { UnitSimulator } from "./UnitSimulator.js";

export class SaveLevelSimulator extends EventDispatcher {

	constructor(data, save = 4, iterations = 1) {
		super();
		this.data = data;
		this.save = save;

		this.results = [];
		this.progress = {};
		this.data.forEach((unit, i) => {
			const sim = new UnitSimulator(unit, save, iterations, i);
			sim.addListener(Event.COMPLETE, this.onComplete, this);
			sim.addListener(Event.PROGRESS, this.onProgress, this);
			this.progress[i] = 0;
		});
	}

	onProgress(e) {
		this.progress[e.target.unit] = e.target.progress;
		let total = 0;
		Object.keys(this.progress).forEach((i) => {
			total += this.progress[i];
		});
		this.dispatch(new Event(Event.PROGRESS, { progress: total/Object.keys(this.progress).length, save: this.save }))
	}

	onComplete(e) {
		this.results.push(e.target);
		if(this.results.length === this.data.length) {
			this.dispatch(new Event(Event.COMPLETE, { results: this.results, save: this.save }));
		}
	}

}