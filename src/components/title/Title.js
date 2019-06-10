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
	}

}