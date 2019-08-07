import { Utils } from "../../utils";
import { AllGraph } from "./AllGraph.js";
import "./Results.scss";

export class AllResults extends Base {


	constructor(data) {
		super();
		this.make("results");
		this.addClass("all-results");

		const graph = new AllGraph();
		this.addChild(graph);
		graph.update(data);	
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}
}