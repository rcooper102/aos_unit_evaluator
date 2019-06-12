import { Utils } from "../../utils";
import { BellCurve } from "./BellCurve.js";
import "./Results.scss";

export class Results extends Base {


	constructor(data, iterations) {
		super();
		this.make("results");
		this._save = null;
		this.data = data;

		this.components = [
			new BellCurve(iterations),
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
	}

	get save() {
		return this._save;
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}