import { Toggle } from "../toggle/Toggle";
import { Utils } from "../../utils";

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
		if(typeof target === "string") {
			target = target.split(",");
		}
		this.boxes.forEach((box) => {
			box.value = false;
		});
		const tar = Array.isArray(target) ? target : [target];
		tar.forEach((item) => {
			const value = Utils.isInteger(item) ? Number(item) : item;
			this.boxes.forEach((box) => {
				if(box.item === value) {
					box.value = true;
				}
			});
		});
	}

	get valid() {
		return true;
	}
}