import "./Title.scss";
import { Utils } from "../../utils";
import { config } from "../../config.js";

export class Title extends Base {

	constructor() {
		super();
		this.make("title");
		this.build();
	}

	build() {
		this.buttons = [];

		const button = new Base();
		button.make("button");
		button.addClass("all");
		button.text = Locale.gen("title-sim-all");
		this.addChild(button);
		button.addListener(MouseEvent.CLICK, this.onAll, this);

		config.simulator.iterations.forEach((item) => {
			const button = new Base();
			button.make("button");
			button.text = Locale.gen("title-iterations", {iterations: Utils.bigNumberFormat(item)});
			button.name = item;
			this.buttons.push(button);
			this.addChild(button);
			button.addListener(MouseEvent.CLICK, this.onSimulate, this);
		});

		const cta = new Header(3);
		cta.text = Locale.gen("app-cta");
		this.addChild(cta);

		const appName = new Header(1);
		appName.text = Locale.gen("app-title");
		this.addChild(appName);

		const appSubName = new Header(2);
		appSubName.text = Locale.gen("app-sub-title");
		this.addChild(appSubName);	
	}

	set buttonActive(target) {
		this._buttonActive = target;
		this.buttons.forEach((button) => {
			if(target) {
				button.removeClass("inactive");
			} else {
				button.addClass("inactive");
			}
		});
	}

	get buttonActive() {
		return this._buttonActive;
	}

	onSimulate(e) {
		this.dispatch(new Event(Event.RELOAD, Number(e.target.name)));
	}

	onAll(e) {
		this.dispatch(new Event(Event.PREVIEW, Number(e.target.name)));
	}

}