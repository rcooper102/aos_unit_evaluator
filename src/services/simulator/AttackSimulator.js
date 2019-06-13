import { Utils } from "../../utils";
import { Buff } from "../../models";

export class AttackSimulator {

	static get ROLL_TYPES() {
		return {
			POSITIVE: "POSITIVE",
			NEGATIVE: "NEGATIVE",
		};
	}

	constructor(data, save) {
		this.data = data;
		
		this._damage = 0;
		const attacks = this.magnitudeRoll(this.data.number);
	
		for(let i = 0; i < attacks; i++) {
			if(this.comparisonRoll(this.data.hit, AttackSimulator.ROLL_TYPES.POSITIVE)) {	
				if(this.comparisonRoll(this.data.wound, AttackSimulator.ROLL_TYPES.POSITIVE)) {
					if(this.comparisonRoll(save + Number(this.data.rend), AttackSimulator.ROLL_TYPES.NEGATIVE)) {
						this._damage += this.magnitudeRoll(this.data.damage);
					}
				}
			}
		}
		this._damage = this._damage;
	}

	comparisonRoll(difficulty, type, buffs) {
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

		if(this.needsReroll(roll, result, buffs)){
			result = this.comparisonRoll(difficulty, type, { ...buffs, [Buff.TYPES.REROLL]: null });
		}

		return result;
	}

	needsReroll(roll, result, buffs) {
		return !result && buffs && buffs[Buff.TYPES.REROLL] && buffs[Buff.TYPES.REROLL].data.indexOf(roll) > -1;
	}

	inverseRoll(difficulty) {
		let roll = Utils.rollDice();
		return roll < difficulty ? true : false;
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
}