import { Toggle } from "../toggle/Toggle";

export class CheckField extends Base {
	constructor(data) {
		super();
		this.make("check-field");

		this.boxes = [];
		this.data = data;
		data.options.forEach((item) => {
			const box = new Toggle(item, item);
			this.addChild(box);
			this.boxes.push(box);
			box.addListener(Event.CHANGE, this.onChange, this);
		});
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE, this));
	}

	get value() {
		return this.boxes.filter((item) => item.value).map((item) => item.item);
	}

	set value(target) {
		this.boxes.forEach((box) => {
			box.value = false;
		});
		target.forEach((item) => {
			this.boxes.forEach((box) => {
				if(box.item === item) {
					box.value = true;
				}
			});
		});
	}

	get valid() {
		return true;
	}
}