import { Utils } from "../../utils";
import { BuffEditor } from "../";
import "./BuffField.scss";

export class BuffField extends Base {

	constructor(label) {
		super();
		this.make("buff-field");
		this.text = "...";
		this.addListener(MouseEvent.CLICK, this.onClick, this);
	}

	onClick() {
		new BuffEditor();
	}

	get value() {
		return "";
	}

	set value(target) {

	}

	get valid() {
		return true;
	}
}