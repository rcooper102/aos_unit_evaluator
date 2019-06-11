import { Utils } from "../../utils";

export class AttackSimulator {

	constructor(data, save) {
		this.data = data;
		
		this._damage = 0;
		const attacks = this.generateAttacks();
		
		for(let i = 0; i < attacks; i++) {
			const hit = Utils.rollDice();
			if(hit >= Number(this.data.hit)) {
				const wound = Utils.rollDice();
				if(wound >= Number(this.data.wound)) {
					const saveRoll = Utils.rollDice();
					if(saveRoll < (save + Number(this.data.rend))) {
						this._damage += this.generateDamage();
					}
				}
			}
		}
	}

	generateDamage() {
		if(Utils.isInteger(this.data.damage)) {
			return Number(this.data.damage);
		} else {
			return Utils.rollDice(this.data.damage);
		}
		return 0;
	}

	generateAttacks() {
		if(Utils.isInteger(this.data.number)) {
			return Number(this.data.number);
		} else {
			return Utils.rollDice(this.data.number);
		}
		return 0;
	}

	get damage() {
		return this._damage;
	}
}