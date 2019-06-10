import { NumberField } from "../";
import { Attack } from "./Attack.js";
import "./Attacks.scss";

export class Attacks extends Base {

	constructor() {
		super();
		this.make("attacks");
		this.build();
	}

	build() {
		const appName = new Header(3);
		appName.text = Locale.gen("attacks-title");
		this.addChild(appName);

		const attackDesc = new Paragraph();
		attackDesc.text = Locale.gen("attacks-desc");
		this.addChild(attackDesc);

		this.unitName = new Input();
		this.unitName.obj.placeholder = Locale.gen("attacks-unit");
		this.unitName.addClass("unit");
		this.addChild(this.unitName);

		this.attacks = [];
		this.add();
	}

	add() {
		const attack = new Attack();
		this.addChild(attack);
		this.attacks.push(attack);
		attack.addListener(Event.CHANGE, this.onAttackChange, this);
		return attack;
	}

	remove(target) {
		this.attacks.forEach((item, i) => {
			if(item === target) {
				item.shutDown();
				this.attacks.splice(i, 1);
			}
		});
	}

	onAttackChange(e) {
		if(e.target === this.attacks[this.attacks.length - 1] && e.target.active) {
			this.add();
		} else if(e.target !== this.attacks[this.attacks.length - 1] && !e.target.active) {
			this.remove(e.target);
		}
		console.log(this.value);
	}

	get value() {
		return {
			name: this.unitName.value,
			attacks: this.attacks
					.filter((item) => { return item.active && item.valid })
					.map((item) => { return item.value }),			
		}
	}

	get valid () {
		let ret = true;
		Object.keys(this.attacks).forEach((i) => { 
			if(!this.attacks[i].valid) {
				ret = false;
			}
		});
		return ret;
	}

}