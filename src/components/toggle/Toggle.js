import "./Toggle.scss";

export class Toggle extends Base {
	constructor(label, item) {
		super();
		this.make("toggle");
		this.text = label;
		this.item = item;
		this._value = false;
		this.addListener(MouseEvent.CLICK, this.onToggle, this);
	}

	onToggle() {
		this.value = !this.value;
		this.dispatch(new Event(Event.CHANGE, this));
	}

	set value(target) {
		this._value = target;
		if(target) {
			this.addClass("active");
		} else {
			this.removeClass("active");
		}
	}

	get value() {
		return this._value;
	}
}