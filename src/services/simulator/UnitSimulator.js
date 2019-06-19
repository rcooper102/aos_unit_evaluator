import { AttackSimulator } from "./AttackSimulator.js";

export class UnitSimulator extends EventDispatcher {

	constructor(data, save, iterations, id) {
		super();
		this.id = id;
		this.data = data;
		this.results = [];
		const thread = new Thread();
		this.highest = 0;
		thread.createFor((i) => {
			let total = 0;
			let mortalWounds = 0;
			let list = [];
			data.attacks.forEach((attack) => {
				const attackSimulator = new AttackSimulator(attack, save, this.transformBuffs(attack.buffs));
				total += attackSimulator.damage;
				mortalWounds += attackSimulator.mortalWounds;
				list.push(attackSimulator.damage);
			});
			if(total > this.highest) {
				this.highest = total;
			}
			this.results.push({
				total,
				list,
				mortalWounds,
			});
			this.dispatch(new Event(Event.PROGRESS, { unit: id, progress: i/iterations }))
		}, iterations);

		thread.addListener(Event.COMPLETE, this.onComplete, this);
	}

	onComplete(e) {
		this.dispatch(new Event(Event.COMPLETE, { highestDamage: this.highest, data: this.data, results: this.results, curve: this.generateCurve(this.results), average: this.generateAverage(this.results) }));
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

	transformBuffs(buffs) {
		const ret = { hit: [], wound: [] };
		if(buffs) {
			buffs.forEach((item) => {
				if(item.hit) { ret.hit.push(item.hit) };
				if(item.wound) { ret.wound.push(item.wound) };
			});
		}
		return ret;
	}

}