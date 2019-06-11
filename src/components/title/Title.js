import "./Title.scss";

export class Title extends Base {

	constructor() {
		super();
		this.make("title");
		this.build();
	}

	build() {
		const appName = new Header(1);
		appName.text = Locale.gen("app-title");
		this.addChild(appName);

		const appSubName = new Header(2);
		appSubName.text = Locale.gen("app-sub-title");
		this.addChild(appSubName);

		this.button = new Base();
		this.button.make("button");
		this.button.text = Locale.gen("app-simulate-button");
		this.addChild(this.button);
		this.button.addListener(MouseEvent.CLICK, this.onSimulate, this);
	}

	set buttonActive(target) {
		this._buttonActive = target;
		if(target) {
			this.button.removeClass("inactive");
		} else {
			this.button.addClass("inactive");
		}
	}

	get buttonActive() {
		return this._buttonActive;
	}

	onSimulate() {
		this.dispatch(new Event(Event.RELOAD, this));
	}

}