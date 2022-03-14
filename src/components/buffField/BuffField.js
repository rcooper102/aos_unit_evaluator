import { Utils } from "../../utils";
import { BuffEditor } from "../";
import "./BuffField.scss";

export class BuffField extends Base {

	constructor(label) {
		super();
		this.make("buff-field");
		this.text = "...";
		this.addListener(MouseEvent.CLICK, this.onClick, this);
		this._value = null;
	}

	onClick() {
		this.activate();
	}

	onChange() {
		this._value = this.editor.value;
		this._options = this.editor.options;
		this.dispatch(new Event(Event.CHANGE, this));
	}

	activate() {
		this.editor = new BuffEditor();
		if(this.value) {
			this.editor.value = this.value;
		}
		if(this.options) {
			this.editor.options = this.options;
		}
		this.editor.addListener(Event.CHANGE, this.onChange, this);
	}

	get options() {
		return this._options;
	}

	set options (target) {
		this._options = target;
	}

	get value() {
		return this._value;
	}

	set value(target) {
		this._value = target;
	}

	get valid() {
		return true;
	}

	get buffs() {
		return true;
	}
}