import { AttackSimulator } from "./AttackSimulator.js";

export class UnitSimulator extends EventDispatcher {

	constructor(data, save, iterations) {
		super();

		this.data = data;
		this.results = [];
		const thread = new Thread();
		thread.createFor((i) => {
			let total = 0;
			let list = [];
			data.attacks.forEach((attack) => {
				const attackSimulator = new AttackSimulator(attack, save);
				total += attackSimulator.damage;
				list.push(attackSimulator.damage);
			});
			this.results.push({
				total,
				list,
			});
		}, iterations);

		thread.addListener(Event.COMPLETE, this.onComplete, this);
	}

	onComplete(e) {
		this.dispatch(new Event(Event.COMPLETE, { data: this.data, results: this.results, curve: this.generateCurve(this.results), average: this.generateAverage(this.results) }));
	}

	generateAverage(results) {
		let total = 0;
		let count = 0;
		results.forEach((item) => {
			count ++;
			total += item.total;
		});
		return total/count;

	}

	generateCurve(results) {
		const values = {}
		results.forEach((item) => {
			if(!values[item.total]) {
				values[item.total] = 0
			}
			values[item.total] ++;
		});
		return values;

	}

}