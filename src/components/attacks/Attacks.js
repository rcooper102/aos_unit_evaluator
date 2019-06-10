import { NumberField } from "../";
import { Utils } from "../../utils";
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

		this.swatch = new Base();
		this.swatch.make('swatch');
		this.swatch.addListener(MouseEvent.CLICK, this.onSwatchChange, this);
		this.addChild(this.swatch);
		this.onSwatchChange();

		this.unitName = new Input();
		this.unitName.obj.placeholder = Locale.gen("attacks-unit");
		this.unitName.addClass("unit");
		this.unitName.addListener(InputEvent.CHANGE, this.onChange, this);
		this.addChild(this.unitName);

		this.attacks = [];
	}

	onSwatchChange() {
		this.color = Utils.generateRandomColor();
		this.dispatch(new Event(Event.CHANGE, this));
	}

	get color() {
		return this._color;
	}

	set color(target) {
		this._color = target;
		this.swatch.style.backgroundColor = this._color;
	}

	add(value) {
		const attack = new Attack();
		this.addChild(attack);
		this.attacks.push(attack);
		attack.value = value;
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
		this.onChange();
	}

	onChange(e) {
		if(this.valid) {
			this.removeClass("error");
		} else {
			this.addClass("error");
		}
		this.dispatch(new Event(Event.CHANGE, this));
	}

	get value() {
		return {
			name: this.unitName.value,
			color: this.color,
			attacks: this.attacks
					.filter((item) => { return item.active && item.valid })
					.map((item) => { return item.value }),			
		}
	}

	set value(target) {
		this.color = target.color;
		this.unitName.value = target.name || "";
		if(!target) {
			this.add();
		} else {
			target.attacks.forEach((item) => {
				this.add(item);
			});
			this.add();
		}

		this.onChange();
	}

	get valid () {
		let ret = true;
		Object.keys(this.attacks).forEach((i) => { 
			if(!this.attacks[i].valid && this.attacks[i].active) {
				ret = false;
			}
		});
		return ret;
	}

}