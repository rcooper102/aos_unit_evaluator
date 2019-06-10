import { NumberField } from "../";
import "./Attacks.scss";

export class Attack extends Base {

	constructor() {
		super();
		this.make("attack");
		this.build();
	}

	build() {
		this.fields = {
			number: new NumberField(Locale.gen("attacks-number"), true),
			hit: new NumberField(Locale.gen("attacks-hit")),
			wound: new NumberField(Locale.gen("attacks-wound")),
			rend: new NumberField(Locale.gen("attacks-rend")),
			damage: new NumberField(Locale.gen("attacks-damage"), true),
		};

		Object.keys(this.fields).forEach((i) => { 
			this.addChild(this.fields[i]);
			this.fields[i].addListener(Event.CHANGE, this.onChange, this);
		});

		this.onChange();
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE, this));
		if(this.active) {
			this.removeClass("inactive");
		} else {
			this.addClass("inactive");
		}
		if(this.valid) {
			this.removeClass("error");
		} else {
			this.addClass("error");
		}
	}

	get active () {
		let ret = false;
		Object.keys(this.fields).forEach((i) => { 
			if(this.fields[i].value !== "") {
				ret = true;
			}
		});
		return ret;
	}

	get valid () {
		let ret = true;
		Object.keys(this.fields).forEach((i) => { 
			if(!this.fields[i].valid || this.fields[i].value === "") {
				ret = false;
			}
		});
		return ret;
	}

	get value () {
		const ret = {};
		Object.keys(this.fields).forEach((i) => { 
			if(this.fields[i].valid) {
				ret[i] = this.fields[i].value;
			} else {
				return null;
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