import { Utils } from "../../utils";

export class InputField extends Base {
	constructor(data) {
		super();
		this.data = data;
		this.make("input-field");

		this.input = new Input();
		this.addChild(this.input);
		this.input.addListener(InputEvent.CHANGE, this.onChange, this);
	}

	onChange(e) {
		if(this.valid) {
			this.input.removeClass("error");
		} else {
			this.input.addClass("error");
		}
		if(e) {
			this.dispatch(new Event(Event.CHANGE, this));
		}
	}

	set value(target) {
		this.input.value = target;
		this.onChange();
	}

	get value() {
		if(this.valid) {
			return this.input.value;
		}else {
			return '';
		}
	}

	get valid() {
		if(this.data.diceNotation && Utils.isDiceNotation(this.input.value)) {
			return true;
		} else if(Utils.isInteger(this.input.value)) {
			return true;
		}
		return false;
	}
}