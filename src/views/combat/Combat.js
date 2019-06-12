import { View } from "../../../velocity/View/View.js";
import { Title, SimConfig, Results, Loading } from "../../components";
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

	onReload(e) {
		if(this.results) {
			this.results.shutDown();
		}
		this.iterations = e.target;
		this.loading = new Loading();
		this.addChild(this.loading);
		const sim = new Simulator(this.simConfig.value, this.iterations);
		sim.addListener(Event.COMPLETE, this.onSimulate, this);
	}

	onSimulate(e) {
		this.loading.shutDown();
		this.results = new Results(e.target, this.iterations);
		this.addChild(this.results);
		this.results.save = 4;
	}

}