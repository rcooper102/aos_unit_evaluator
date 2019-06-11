import { UnitSimulator } from "./UnitSimulator.js";

export class SaveSimulator extends EventDispatcher {

	constructor(data, save = 4, iterations = 1) {
		super();
		this.data = data;
		this.save = save;

		this.results = [];
		this.data.forEach((unit) => {
			const sim = new UnitSimulator(unit, save, iterations);
			sim.addListener(Event.COMPLETE, this.onComplete, this);
		});
	}

	onComplete(e) {
		this.results.push(e.target);
		if(this.results.length === this.data.length) {
			this.dispatch(new Event(Event.COMPLETE, { results: this.results, save: this.save }));
		}
	}

}