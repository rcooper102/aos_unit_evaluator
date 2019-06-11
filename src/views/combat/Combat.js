import { View } from "../../../velocity/View/View.js";
import { Title, SimConfig } from "../../components";
import "./Combat.scss";

export class Combat extends View {

	constructor(params) {
		super(params, "combat");
		this.build();
	}

	build() {
		this.simConfig = new SimConfig();
		this.simConfig.addListener(Event.CHANGE, this.onConfigChange, this);

		const components = [
			new Title(),
			this.simConfig,
		];

		components.forEach((item) => {
			this.addChild(item);
		});
	}

	onConfigChange(e) {
		console.log(this.simConfig.valid);
	}

}