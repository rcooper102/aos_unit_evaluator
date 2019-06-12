import { Utils } from "../../utils";
import { Histogram } from "./Histogram.js";
import { BarGraph } from "./BarGraph.js";
import { SaveNavigation } from "./SaveNavigation.js";
import "./Results.scss";

export class Results extends Base {


	constructor(data, iterations, highestDamage) {
		super();
		this.make("results");
		this._save = null;
		this.data = data;

		this.saveNav = new SaveNavigation();
		this.addChild(this.saveNav);
		this.saveNav.addListener(Event.ACTIVATE, this.onChangeSave, this);

		this.components = [
			new Histogram(iterations, highestDamage),
			new BarGraph([
				{ value: 5, color: "#f00" },
				{ value: 10, color: "#ff0" },
			], "title", "subtitle")
		]

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
		console.log(this.data[target]);
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