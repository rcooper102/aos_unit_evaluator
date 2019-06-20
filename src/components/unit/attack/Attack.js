import { NumberField, BuffField } from "../../";
import { Buff } from "../../../models";
import "./Attack.scss";

export class Attack extends Base {

	constructor() {
		super();
		this.make("attack");
		this.build();
	}

	build() {
		this.fields = {
			number: new NumberField(Locale.gen("attacks-number"), NumberField.TYPES.DICE_NOTATION, 5),
			hit: new NumberField(Locale.gen("attacks-hit"), NumberField.TYPES.ROLL_VALUE, 1),
			wound: new NumberField(Locale.gen("attacks-wound"), NumberField.TYPES.ROLL_VALUE, 1),
			rend: new NumberField(Locale.gen("attacks-rend"), NumberField.TYPES.INTEGER, 1),
			damage: new NumberField(Locale.gen("attacks-damage"), NumberField.TYPES.DICE_NOTATION, 5),
			buffs: new BuffField(""),
		};

		Object.keys(this.fields).forEach((i) => { 
			this.addChild(this.fields[i]);
			this.fields[i].addListener(Event.CHANGE, this.onChange, this);
		});

		this.summary = new AttackBuffSummary();
		this.addChild(this.summary);
		this.summary.addListener(MouseEvent.CLICK, this.onBuffs, this);

		this.onChange();
	}

	onBuffs() {
		this.fields.buffs.activate();
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE, this));
		this.summary.data = this.fields.buffs.value;
		if(this.active) {
			this.removeClass("inactive");
		} else {
			this.addClass("inactive");
		}
		if(this.valid) {
			this.removeClass("error");
		} else if(this.active) {
			this.addClass("error");
		}
	}

	get active () {
		let ret = false;
		Object.keys(this.fields).forEach((i) => {
			if(this.fields[i].value !== "" && !this.fields[i].buffs) {
				ret = true;
			}
		});
		return ret;
	}

	get valid () {
		let ret = true;
		Object.keys(this.fields).forEach((i) => { 
			if(!this.fields[i].valid) {
				ret = false;
			}
		});
		return ret;
	}

	get value () {
		const ret = {};
		Object.keys(this.fields).forEach((i) => { 
			ret[i] = this.fields[i].value;
		});
		return ret;
	}

	set value(target) {
		if(target) {
			Object.keys(this.fields).forEach((i) => {
				if(target[i]) {
					this.fields[i].value = target[i];
				}
			});
		}
		this.summary.data = this.fields.buffs.value;
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}


class AttackBuffSummary extends Base {

	static get SCHEMA() {
		return {
			[Buff.TYPES.REROLL]: "attack-buff-summary-reroll",
			[Buff.TYPES.TRIGGER_MORTAL]: "attack-buff-summary-trigger-mortal",
			[Buff.TYPES.TRIGGER_DAMAGE]: "attack-buff-summary-trigger-damage",
			[Buff.TYPES.TRIGGER_REND]: "attack-buff-summary-trigger-rend",
			[Buff.TYPES.TRIGGER_ATTACKS]: "attack-buff-summary-trigger-attacks",
		}
	}

	constructor() {
		super();
		this.make("buff-summary");
	}

	get data() {
		return this._data;
	}

	set data(target) {
		this._data = target;
		this.text = "";
		this.style.display = "none";
		if(this._data) {
			this._data.forEach((item) => {
				Object.keys(item).forEach((roll) => {
					this.style.display = "block";
					const buff = new Base();
					buff.make("buff");
					this.addChild(buff);
					let data = item[roll].data;
					if(Array.isArray(item[roll].data)) {
						data = { data: item[roll].data.join(",") };
					} else {
						Object.keys(data).forEach((key) => {
							if(Array.isArray(data[key])) {
								data[key] = data[key].join(",");
							}
						});
					}
					buff.text = Locale.gen(AttackBuffSummary.SCHEMA[item[roll].type], {
						...data,
						type: roll,
					});
				});
			});
		}
	}
}