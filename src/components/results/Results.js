import { Utils } from "../../utils";
import { Histogram } from "./Histogram.js";
import { AverageGraph } from "./AverageGraph.js";
import { SaveNavigation } from "./SaveNavigation.js";
import { WhiffGraph } from "./WhiffGraph.js";
import { ReliabilityGraph } from "./ReliabilityGraph.js";
import { PotentialGraph } from "./PotentialGraph.js";
import "./Results.scss";

export class Results extends Base {


	constructor(data, iterations, highestDamage) {
		super();
		this.make("results");
		this._save = null;
		this.data = data;

		const title = new Header(3);
		title.text = Locale.gen("results-title");
		this.addChild(title);

		this.saveNav = new SaveNavigation();
		this.addChild(this.saveNav);
		this.saveNav.addListener(Event.ACTIVATE, this.onChangeSave, this);

		this.components = [
			new Histogram(iterations, highestDamage),
			new AverageGraph(),
			new ReliabilityGraph(),			
			new WhiffGraph(),
			new PotentialGraph(),
		];

		this.components.forEach((item) => {
			this.addChild(item);
		});
	}

	set save(target) {
		this._save = target;
		if(this.data[target]) {
			this.components.forEach((item) => {
				item.update(this.data[target]);
			});
		}
		this.saveNav.value = target;
	}

	get save() {
		return this._save;
	}

	onChangeSave(e) {
		if(e.target !== this.save) {
			this.save = e.target;
		}
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}