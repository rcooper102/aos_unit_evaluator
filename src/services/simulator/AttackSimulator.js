import { Utils } from "../../utils";
import { Buff } from "../../models";

export class AttackSimulator {

	static get ROLL_TYPES() {
		return {
			POSITIVE: "POSITIVE",
			NEGATIVE: "NEGATIVE",
		};
	}

	constructor(data, save, buffs = { hit: [], wound: [] }) {
		this.data = data;
		this.save = save;
		this.buffs = buffs;
		this._damage = 0;
		this._mortalWounds = 0;
		const attacks = this.magnitudeRoll(this.data.number);

		this.makeAttacks(attacks);
	}

	makeAttacks(attacks, canSpawnAttacks = true, autoHit = false, autoWound = false) {
		for(let i = 0; i < attacks; i++) {
			const hit = this.comparisonRoll(this.data.hit, AttackSimulator.ROLL_TYPES.POSITIVE, this.buffs.hit, canSpawnAttacks, autoHit);
			if(hit.result) {
				const wound = this.comparisonRoll(this.data.wound, AttackSimulator.ROLL_TYPES.POSITIVE, this.buffs.wound, canSpawnAttacks);	
				if(wound.result) {
					const rend = hit.rendOverride || wound.rendOverride || Number(this.data.rend);
					const damage = hit.damageOverride || wound.damageOverride || this.magnitudeRoll(this.data.damage);
					if(this.comparisonRoll(this.save + rend, AttackSimulator.ROLL_TYPES.NEGATIVE).result) {
						this._damage += damage;
					}
				}
			}
		}
	}

	comparisonRoll(difficulty, type, buffs, canSpawnAttacks, auto = false) {
		if(auto) { return { result: true } }
		const diff = Number(difficulty);
		let roll = Utils.rollDice();
		let result = false;
		
		switch(type) {
			case AttackSimulator.ROLL_TYPES.POSITIVE: 
				result = roll >= diff ? true : false;
				break;
			case AttackSimulator.ROLL_TYPES.NEGATIVE: 
				result = roll < diff ? true : false;
				break;
		}

		let output = { result, roll };

		if(this.needsReroll(output.roll, result, buffs)){
			output = this.comparisonRoll(difficulty, type, buffs.filter((item) => item.type !== Buff.TYPES.REROLL));
		} else {
			output = this.checkTriggers(output.result, output.roll, buffs, canSpawnAttacks);
		}

		return output;
	}

	checkTriggers(result, roll, buffs, canSpawnAttacks) {
		let rendOverride = null;
		let damageOverride = null;
		if(buffs) {
			buffs.forEach((buff) => {
				switch(buff.type) {
					case Buff.TYPES.TRIGGER_MORTAL:
						if(buff.data.trigger.indexOf(roll) > -1) {
							const wounds = this.magnitudeRoll(buff.data.output);
							this._mortalWounds += wounds;
							this._damage += wounds;
							if(buff.data.stop) {
								result = false;
							}
						}
					break;
					case Buff.TYPES.TRIGGER_ATTACKS:
						if(canSpawnAttacks && buff.data.trigger.indexOf(roll) > -1) {
							this.makeAttacks(this.magnitudeRoll(buff.data.output), false, buff.data.autoHit, buff.data.autoWound);
							if(buff.data.stop) {
								result = false;
							}
						}
					break;
					case Buff.TYPES.TRIGGER_REND:
						if(buff.data.trigger.indexOf(roll) > -1) {
							rendOverride = this.magnitudeRoll(buff.data.output);
						}
					break;
					case Buff.TYPES.TRIGGER_DAMAGE:
						if(buff.data.trigger.indexOf(roll) > -1) {
							damageOverride = this.magnitudeRoll(buff.data.output);
						}
					break;
				}
			});
		}
		return { result, rendOverride, damageOverride, roll };
	}

	needsReroll(roll, result, buffs) {
		if(buffs) {
			const buff = buffs.filter((item) => item.type === Buff.TYPES.REROLL);
			return !result && buff[0] && buff[0].data.indexOf(roll) > -1;
		}
		return false;
	}

	magnitudeRoll(dice) {
		if(Utils.isInteger(dice)) {
			return Number(dice);
		} else {
			return Utils.rollDice(dice);
		}
		return 0;
	}

	get damage() {
		return this._damage;
	}

	get mortalWounds() {
		return this._mortalWounds;
	}
}