import { View } from "../../../velocity/View/View.js";
import { Title, SimConfig, Results, Loading, AllResults } from "../../components";
import { Simulator, AllSimulator } from "../../services";
import { config } from "../../config.js";
import "./Combat.scss";

export class Combat extends View {

	constructor(params) {
		super(params, "combat");
		this.build();
	}

	build() {
		this.appTitle = new Title();
		this.appTitle.addListener(Event.RELOAD, this.onReload, this);
		this.appTitle.addListener(Event.PREVIEW, this.onAllSim, this);

		this.simConfig = new SimConfig();
		this.simConfig.addListener(Event.CHANGE, this.onConfigChange, this);
		this.simConfig.addListener(Event.ACTIVATE, this.onReload, this);

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
		if(!this.simulating && this.simConfig.valid) {
			this.simulating = true;
			if(this.results) {
				this.results.shutDown();
			}
			this.iterations = e.target;
			this.loading = new Loading();
			this.addChild(this.loading);
			const sim = new Simulator(this.simConfig.value, this.iterations);
			sim.addListener(Event.COMPLETE, this.onSimulate, this);
			sim.addListener(Event.PROGRESS, this.onProgess, this);
		}
	}

	onAllSim(e) {
		if(!this.simulating) {
			this.simulating = true;
			if(this.results) {
				this.results.shutDown();
			}
			this.loading = new Loading();
			this.addChild(this.loading);
			const sim = new AllSimulator();
			sim.addListener(Event.COMPLETE, this.onAllSimulate, this);
			sim.addListener(Event.PROGRESS, this.onProgess, this);
		}
	}

	onAllSimulate(e) {
		this.loading.shutDown();
		this.results = new AllResults(e.target.results);
		this.addChild(this.results);
	}

	onProgess(e) {
		this.loading.progress = e.target;
	}

	onSimulate(e) {
		this.simulating = false;
		this.loading.shutDown();
		this.results = new Results(e.target.results, this.iterations, e.target.highestDamage);
		this.addChild(this.results);
		this.results.save = config.simulator['default-save'];
	}

}