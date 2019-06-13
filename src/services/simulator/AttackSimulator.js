import { Utils } from "../../utils";

export class AttackSimulator {

	constructor(data, save) {
		this.data = data;
		
		this._damage = 0;
		const attacks = this.executeRoll(this.data.number);
		
		for(let i = 0; i < attacks; i++) {
			const hit = Utils.rollDice();
			if(hit >= Number(this.data.hit)) {
				const wound = Utils.rollDice();
				if(wound >= Number(this.data.wound)) {
					const saveRoll = Utils.rollDice();
					if(saveRoll < (save + Number(this.data.rend))) {
						this._damage += this.executeRoll(this.data.damage);
					}
				}
			}
		}
		this._damage = this._damage;
	}

	executeRoll(dice) {
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