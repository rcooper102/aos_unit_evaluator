import { Utils } from "../../utils";
import { AllGraph } from "./AllGraph.js";
import { AllHistogram } from "./AllHistogram.js";
import "./Results.scss";

export class AllResults extends Base {


	constructor(data) {
		super();
		this.make("results");
		this.addClass("all-results");

		const title = new Header(3);
		title.text = Locale.gen("all-histogram-title");
		this.addChild(title);

		const sub = new Base();
		sub.make("rolls");
		sub.text = Locale.gen("all-histogram-sub-title");
		this.addChild(sub);


		const histogram = new AllHistogram();
		this.addChild(histogram);
		histogram.update(data);	

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