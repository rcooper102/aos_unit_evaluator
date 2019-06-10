import { Utils } from "../../utils";
import "./NumberField.scss";

export class NumberField extends Base {

	constructor(label,allowDice) {
		super();
		this.make("number-field");
		this.build(label);
		this.allowDice = true
	}

	build(label) {
		this.input = new Input();
		this.input.obj.placeholder = label;
		this.input.maxLength = 8;
		this.addChild(this.input);
		this.input.addListener(InputEvent.CHANGE, this.onChange, this);
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE, this));
		if(this.valid) {
			this.input.removeClass("error");
		} else {
			this.input.addClass("error");
		}
	}

	get value() {
		return this.input.value;
	}

	get valid() {
		if(!this.allowDice) {
			return Utils.isInteger(this.input.value);
		} else {
			return Utils.isInteger(this.input.value) || Utils.isDiceNotation(this.input.value);
		}
	}

}