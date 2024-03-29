import { Utils } from "../../utils";
import { Histogram } from "./Histogram.js";
import { AverageGraph } from "./AverageGraph.js";
import { SaveNavigation } from "./SaveNavigation.js";
import { WhiffGraph } from "./WhiffGraph.js";
import { ReliabilityGraph } from "./ReliabilityGraph.js";
import { PotentialGraph } from "./PotentialGraph.js";
import { MortalWoundsGraph } from "./MortalWoundsGraph.js";
import { DependabilityGraph } from "./DependabilityGraph.js";
import { SaveComparison } from "./SaveComparison.js";
import { ResultsHeader } from "./ResultsHeader.js";
import { SaveComparisonTable } from "./SaveComparisonTable.js";
import { DamageOddsTable } from "./DamageOddsTable.js";
import { KillsGraph } from "./KillsGraph.js";
import "./Results.scss";

export class Results extends Base {


	constructor(data, iterations, highestDamage) {
		super();
		this.make("results");
		this._save = null;
		this.data = this.sortResults(data);

		const count = Utils.bigNumberFormat(data[Object.keys(data)[0]][0].results.length);
		const rolls = Utils.commaNumberFormat(Utils.rollCount);

		const normalizedPoints = data[Object.keys(data)[0]][0].data.normalizedPoints || null;
		let norm;
		if(normalizedPoints) {
			norm = new Base;
			norm.make("normalized");
			norm.text = Locale.gen("results-normalized", { points: normalizedPoints });
			norm.title = Locale.gen("results-normalized-details");
		}

		this.saveNav = new SaveNavigation();
		this.saveNav.addListener(Event.ACTIVATE, this.onChangeSave, this);

		this.components = [
			new ResultsHeader(count, rolls),
			norm,
			this.saveNav,
			new Histogram(iterations, highestDamage),
			new KillsGraph(),
			new AverageGraph(),
			new ReliabilityGraph(),			
			new WhiffGraph(),
			new PotentialGraph(),
			new MortalWoundsGraph(),
			// new DependabilityGraph(),
			new SaveComparison(this.data),
			new SaveComparisonTable(this.data),
			new SaveComparison(this.data, true),
			new SaveComparisonTable(this.data, true),
		];

		if(!normalizedPoints) {
			this.components.push(new DamageOddsTable(this.data));
			this.components.push(new DamageOddsTable(this.data, true));
		}

		this.components.forEach((item) => {
			if(item) {
				this.addChild(item);
			}
		});
	}

	sortResults(data) {
		Object.keys(data).forEach((key) => {
			data[key].sort((a,b) => {
				return a.data.id > b.data.id ? 1 : -1;
			});
		});
		return data;
	}

	set save(target) {
		this._save = target;
		if(this.data[target]) {
			this.components.forEach((item) => {
				if(item && item.update) {
					item.update(this.data[target],target);
				}
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