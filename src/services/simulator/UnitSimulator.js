import { AttackSimulator } from "./AttackSimulator.js";

export class UnitSimulator extends EventDispatcher {

	constructor(data, save, iterations, id, enemyUnit) {
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
			let kills = 0;
			this.diseasePoints = 0;
			this.killsLeftOver = 0;
			data.attacks.forEach((attack) => {
				const attackSimulator = new AttackSimulator(attack, save, this.transformBuffs(attack.buffs), this.diseasePoints || 0, this.data['normalizedRatio'] || 1, enemyUnit, (1 - this.killsLeftOver)*enemyUnit.wounds);
				total += attackSimulator.damage;
				kills += Math.floor(attackSimulator.kills);
				this.killsLeftOver = attackSimulator.kills - Math.floor(attackSimulator.kills);
				mortalWounds += attackSimulator.mortalWounds;
				list.push(attackSimulator.damage);
				
				this.diseasePoints = attackSimulator.diseasePoints;
			});

			kills += this.killsLeftOver;

			if(total > this.highest) {
				this.highest = total;
			}
			this.results.push({
				total,
				list,
				kills,
				mortalWounds,
			});
			this.dispatch(new Event(Event.PROGRESS, { unit: id, progress: i/iterations }))
		}, iterations);

		thread.addListener(Event.COMPLETE, this.onComplete, this);
	}

	onComplete(e) {
		this.dispatch(new Event(Event.COMPLETE, { highestDamage: this.highest, data: this.data, results: this.results, averageKills: this.generateKills(this.results), curve: this.generateCurve(this.results), ...this.generateAverage(this.results) }));
	}

	generateKills(results) {
		let total = 0;
		let count = 0;
		results.forEach((item) => {
			count ++;
			total += item.kills;
		});
		return total/count;
	}

	generateAverage(results) {
		let total = 0;
		let mws = 0;
		let count = 0;
		results.forEach((item) => {
			count ++;
			mws += item.mortalWounds || 0,
			total += item.total;
		});
		return { average: total/count, mortalWounds: mws/count };
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