import { NumberField } from "../";
import "./Attacks.scss";

export class Attacks extends Base {

	constructor() {
		super();
		this.make("attacks");
		this.build();
	}

	build() {
		const appName = new Header(3);
		appName.text = Locale.gen("attacks-title");
		this.addChild(appName);

		const fields = {
			number: new NumberField(Locale.gen("attacks-number"), true),
			hit: new NumberField(Locale.gen("attacks-hit")),
			wound: new NumberField(Locale.gen("attacks-wound")),
			rend: new NumberField(Locale.gen("attacks-rend")),
			damage: new NumberField(Locale.gen("attacks-damage"), true),
		};

		Object.keys(fields).forEach((i) => { 
			this.addChild(fields[i]);
			fields[i].addListener(Event.CHANGE, (e) => {
				console.log(e.target.valid);
			}, this); 
		});
	}

}