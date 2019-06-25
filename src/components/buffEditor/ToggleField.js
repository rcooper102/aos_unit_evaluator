import { CheckField } from "./CheckField";

export class ToggleField extends CheckField {
	constructor(data) {
		super({ ...data, options: [ Locale.gen("toggle-field-yes")] });
		this.data = data;
		this.addListener(Event.CHANGE, this.onToggle, this);
		this.onChange();
	}

	onToggle(e) {
		if(this.value) {
			this.boxes[0].text = Locale.gen("toggle-field-yes");
		} else {
			this.boxes[0].text = Locale.gen("toggle-field-no");
		}
	}

	set value(target) {
		this.boxes[0].value = target;
		this.onChange();
	}

	get value() {
		return this.boxes[0].value;
	}
}