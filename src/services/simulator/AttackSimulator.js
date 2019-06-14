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
					const damage = hit.damageOverride || wound.damageOverride || Number(this.data.damage);
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
		let output = {};
		switch(type) {
			case AttackSimulator.ROLL_TYPES.POSITIVE: 
				result = roll >= diff ? true : false;
				break;
			case AttackSimulator.ROLL_TYPES.NEGATIVE: 
				result = roll < diff ? true : false;
				break;
		}

		if(this.needsReroll(roll, result, buffs)){
			output = this.comparisonRoll(difficulty, type, { ...buffs, [Buff.TYPES.REROLL]: null });
		}

		output = this.checkTriggers(result, roll, buffs, canSpawnAttacks);

		return { ...output, result };
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
		return { result, rendOverride, damageOverride };
	}

	needsReroll(roll, result, buffs) {
		return !result && buffs && buffs[Buff.TYPES.REROLL] && buffs[Buff.TYPES.REROLL].data.indexOf(roll) > -1;
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