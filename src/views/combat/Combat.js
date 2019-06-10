import { View } from "../../../velocity/View/View.js";
import { Title, SimConfig } from "../../components";
import "./Combat.scss";

export class Combat extends View {

	constructor(params) {
		super(params, "combat");
		this.build();
	}

	build() {
		const components = [
			new Title(),
			new SimConfig(),
		];

		components.forEach((item) => {
			this.addChild(item);
		});
	}

}