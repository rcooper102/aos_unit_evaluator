import { config } from "../../config.js";

export class SaveNavigation extends Base {


	constructor(data, iterations) {
		super();
		this.make("save-navigation");

		const label = new Label();
		label.text = Locale.gen("save-navigation-label");
		this.addChild(label);

		this.saves = {};
		config.simulator.saves.forEach((save) => {
			const button = new Base();
			button.make("save");
			button.text = `${save}+`;
			button.name = save;
			this.addChild(button);
			this.saves[save] = button;
			button.addListener(MouseEvent.CLICK, this.onActivate, this);
		})
	}

	onActivate(e) {
		this.dispatch(new Event(Event.ACTIVATE, e.target.name));
	}

	set value(target) {
		this._value = target;
		Object.keys(this.saves).forEach((i) => {
			if(Number(i) === target) {
				this.saves[i].addClass("active");
			} else {
				this.saves[i].removeClass("active");
			}
		});
	}

	get value() {
		return this._value;
	}
}