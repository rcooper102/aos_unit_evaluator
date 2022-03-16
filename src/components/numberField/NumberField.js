import { Utils } from "../../utils";
import "./NumberField.scss";

export class NumberField extends Base {

	static get TYPES() {
		return {
			DICE_NOTATION: "DICE_NOTATION",
			ROLL_VALUE: "ROLL_VALUE",
			INTEGER: "INTEGER",
		};	
	}

	constructor(label,type, maxLength) {
		super();
		this.make("number-field");
		this.maxLength = maxLength;
		this.type = type;
		this.build(label);	
	}

	build(label) {
		this.input = new Input();
		this.input.obj.placeholder = label;
		this.input.maxLength = this.maxLength;
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

	set value(target) {
		this.input.value = target;
		this.onChange(null);
	}

	get valid() {
		switch(this.type) {
			case NumberField.TYPES.DICE_NOTATION:
				return Utils.isInteger(this.input.value) || Utils.isDiceNotation(this.input.value);
				break;
			case NumberField.TYPES.ROLL_VALUE:
				return Utils.isInteger(this.input.value) && Number(this.input.value) <= 6;
				break;
			case NumberField.TYPES.INTEGER:
				return Utils.isInteger(this.input.value);
				break;
			default:
				return true;
		};
	}

}