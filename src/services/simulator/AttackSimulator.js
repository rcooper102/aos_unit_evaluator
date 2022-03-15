import { Utils } from "../../utils";
import { Buff } from "../../models";

export class AttackSimulator {

	static get ROLL_TYPES() {
		return {
			POSITIVE: "POSITIVE",
			NEGATIVE: "NEGATIVE",
		};
	}

	static get MAX_DISEASE() {
		return 7;
	}

	constructor(data, save, buffs = { hit: [], wound: [] }, diseasePoints = 0, normalizedRatio = 1, targetUnit = null, remainingWounds = 0) {
		this.data = data;
		this.save = save;
		this.buffs = buffs;
		this._damage = 0;
		this._kills = 0;
		this._mortalWounds = 0;
		this.targetUnit = targetUnit;
		this.noSplash = this.data.options && this.data.options.noSplash ? this.data.options.noSplash : false;
		this.remainingWounds = remainingWounds;
		const attacks = this.magnitudeRoll(this.data.number);
		this.diseasePoints = diseasePoints;
		this.normalizedRatio = normalizedRatio;
		this.makeAttacks(attacks);
	}

	makeAttacks(attacks, canSpawnAttacks = true, autoHit = false, autoWound = false) {
		let i;
		if(this.targetUnit) {
			this.resetWounds(this.remainingWounds);
		}
		for(i = 0; i < attacks; i++) {
			this.currentMortalWounds = 0;
			const hit = this.comparisonRoll(this.data.hit, AttackSimulator.ROLL_TYPES.POSITIVE, this.buffs.hit, canSpawnAttacks, autoHit);
			if(hit.result) {
				let wound;
				if(hit.woundOverride) {
					wound = hit;
				} else {
					wound = this.comparisonRoll(this.data.wound, AttackSimulator.ROLL_TYPES.POSITIVE, this.buffs.wound, canSpawnAttacks);	
				}
				if(wound.result) {
					const rend = hit.rendOverride || wound.rendOverride || +(this.data.rend);
					let damage = hit.damageOverride || wound.damageOverride || this.magnitudeRoll(this.data.damage);
					if(this.comparisonRoll(this.determineSave(this.save, rend), AttackSimulator.ROLL_TYPES.NEGATIVE).result) {
						damage = this.shrugDamage(damage);
						this._damage += damage;
						if(this.targetUnit && this.noSplash) {
							for(let i = 0; i < this.normalizedRatio; i++) {
								this.currentWounds -= damage;
								this.checkWounds();
							}
						}
					}
				}
			}
			this.currentMortalWounds = this.shrugDamage(this.currentMortalWounds);
			this._damage += this.currentMortalWounds;
			this._mortalWounds += this.currentMortalWounds;
		}

		if(this.targetUnit) {
			if(this.noSplash) {
				for(let i = 0; i < this._mortalWounds; i++) {
					this.currentWounds --;
					this.checkWounds();
				}
			} else {
				this._kills = this.reconcileDamage(this._damage);
			}	
		}

		//Whole kills + partial kills expressed as decimal.
		if(this.targetUnit) {
			this.killsTotal = this._kills + (this.targetUnit.wounds - this.currentWounds) / this.targetUnit.wounds
		}
	}

	checkWounds() {
		if(this.currentWounds <= 0) {
			this._kills ++;
			this.resetWounds();
		}
	}

	reconcileDamage(damage) {
		let kills = Math.floor(damage / this.targetUnit.wounds);
		this.currentWounds = this.targetUnit.wounds - (damage - (kills * this.targetUnit.wounds));
		return kills;
	}

	shrugDamage(damage) {
		if(this.targetUnit && this.targetUnit.shrug) {
			let unshruggedDamage = 0;
			for(let i = 0; i < damage; i++) {
				if(this.comparisonRoll(this.targetUnit.shrug, AttackSimulator.ROLL_TYPES.NEGATIVE).result) {
					unshruggedDamage ++;
				}
			}
			return unshruggedDamage;
		}
		return damage;
	}

	determineSave(save, rend) {
		let ret = save + rend;
		if(this.targetUnit && this.targetUnit.invulnerable && ret > this.targetUnit.invulnerable) {
			ret = this.targetUnit.invulnerable;
		}
		return ret;
	}

	resetWounds(remainingWounds){
		if(!remainingWounds) {
			this.currentWounds = this.targetUnit.wounds || 1;
		} else {
			this.currentWounds = remainingWounds;
		}
	}

	comparisonRoll(difficulty, type, buffs, canSpawnAttacks, auto = false) {
		if(auto) { return { result: true } }
		const diff = +(difficulty);
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
		let woundOverride = null;
		if(buffs) {
			buffs.forEach((buff) => {
				switch(buff.type) {
					case Buff.TYPES.TRIGGER_MORTAL:
						if(buff.data.trigger.indexOf(roll) > -1) {
							this.currentMortalWounds += this.magnitudeRoll(buff.data.output) * this.normalizedRatio;
							if(buff.data.stop) {
								result = false;
							}
						}
					break;
					case Buff.TYPES.TRIGGER_DISEASE:
						if(buff.data.trigger.indexOf(roll) > -1) {
							this.diseasePoints ++;
							if(buff.data.virulence.indexOf(Utils.rollDice()) > -1 && this.diseasePoints <= (AttackSimulator.MAX_DISEASE*this.normalizedRatio)) {
								this.currentMortalWounds += this.magnitudeRoll(buff.data.output)  * this.normalizedRatio;
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
					case Buff.TYPES.TRIGGER_WOUND:
						if(buff.data.trigger.indexOf(roll) > -1) {
							woundOverride = true;
						}
					break;
				}
			});
		}
		return { result, rendOverride, damageOverride, woundOverride, roll };
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

	get kills() {
		return this._kills;
	}

	get damage() {
		return this._damage;
	}

	get mortalWounds() {
		return this._mortalWounds;
	}
}