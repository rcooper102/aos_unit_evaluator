import { View } from "../../../velocity/View/View.js";
import { Title, SimConfig, Results } from "../../components";
import { Simulator } from "../../services";
import "./Combat.scss";

export class Combat extends View {

	constructor(params) {
		super(params, "combat");
		this.build();
	}

	build() {
		this.appTitle = new Title();
		this.appTitle.addListener(Event.RELOAD, this.onReload, this);

		this.simConfig = new SimConfig();
		this.simConfig.addListener(Event.CHANGE, this.onConfigChange, this);

		const components = [
			this.appTitle,
			this.simConfig,
		];

		components.forEach((item) => {
			this.addChild(item);
		});

		this.onConfigChange();
	}

	onConfigChange(e) {
		this.appTitle.buttonActive = this.simConfig.valid;
	}

	onReload() {
		const sim = new Simulator(this.simConfig.data);
		sim.addListener(Event.COMPLETE, this.onSimulate, this);
	}

	onSimulate(e) {
		if(this.results) {
			this.results.shutDown();
		}
		this.results = new Results(e.target);
		this.addChild(this.results);
		this.results.save = 4;
	}

}