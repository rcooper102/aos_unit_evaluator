import { Attacks } from "../";
import "./SimConfig.scss";

export class SimConfig extends Base {

	constructor() {
		super();
		this.make("sim-config");
		this.build();
	}

	build() {
		const appName = new Header(3);
		appName.text = Locale.gen("sim-config-title");
		this.addChild(appName);

		this.attacks = new Attacks();
		this.addChild(this.attacks);
	}

}