import { NumberField } from "../";
import { Utils } from "../../utils";
import { Attack } from "./attack/Attack.js";
import "./Unit.scss";

export class Unit extends Base {

	constructor() {
		super();
		this.make("unit");
		this.build();
	}

	build() {
		this.swatch = new Base();
		this.swatch.make('swatch');
		this.swatch.addListener(MouseEvent.CLICK, this.onSwatchChange, this);
		this.addChild(this.swatch);
		this.onSwatchChange();

		this.unitName = new Input();
		this.unitName.obj.placeholder = Locale.gen("unit-name");
		this.unitName.addClass("unit");
		this.unitName.addListener(InputEvent.CHANGE, this.onChange, this);
		this.addChild(this.unitName);

		this.unitPoints = new Input();
		this.unitPoints.obj.placeholder = Locale.gen("unit-points");
		this.unitPoints.addClass("points");
		this.unitPoints.addListener(InputEvent.CHANGE, this.onChange, this);
		this.addChild(this.unitPoints);

		this.delete = new Base();
		this.delete.make("button");
		this.delete.text = Locale.gen("unit-delete");
		this.delete.addListener(MouseEvent.CLICK, this.onDelete, this);
		this.addChild(this.delete);

		this.attacks = [];
	}

	onDelete() {
		this.dispatch(new Event(Event.REMOVE, this));		
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
		target.shutDown();
		this.attacks.filter((item) => item !== target);
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
			points: this.unitPoints.value !== "" ? this.unitPoints.value : null,
			color: this.color,
			attacks: this.attacks
					.filter((item) => { return item.active })
					.map((item) => { return item.value }),			
		}
	}

	set value(target) {		
		if(!target) {
			this.add();
		} else {
			this.color = target.color;
			this.unitPoints.value = target.points || "";
			this.unitName.value = target.name || "";
			target.attacks.forEach((item) => {
				this.add(item);
			});
			this.add();
		}

		this.onChange();
	}

	get valid () {
		let ret = true;
		if(this.attacks.length === 1) {
			return false;
		}
		Object.keys(this.attacks).forEach((i) => { 
			if(!this.attacks[i].valid && this.attacks[i].active) {
				ret = false;
			}
		});
		return ret;
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}