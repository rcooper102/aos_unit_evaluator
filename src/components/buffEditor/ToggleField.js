import { CheckField } from "./CheckField";

export class ToggleField extends CheckField {
	constructor(data) {
		super({ ...data, options: [Locale.gen("toggle-field-yes")] });
		this.data = data;
	}

	set value(target) {
		this.boxes[0].value = target;
	}

	get value() {
		return this.boxes[0].value;
	}
}