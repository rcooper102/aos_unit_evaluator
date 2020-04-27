const html2Canvas = require("html2canvas");

export class Screenshot extends EventDispatcher {

	static get MODES() {
		return  {
			RESULTS: { query: "results", fix: Screenshot.fixResults, cleanup: Screenshot.cleanResults },
			RESULTS_SMALL: { query: "results", fix: Screenshot.fixSmallResults, cleanup: Screenshot.cleanResults },
		};
	}

	constructor (mode, name = "relic-wargaming-attack-simulator-report.jpg") {
		super();

		if(mode) {
			mode.fix();
		}

		const location = document.body;
		
		html2Canvas(document.querySelector(mode.query), {
        	scrollX: 0,
        	scrollY: 0,
      	}).then((canvas) => {
		    location.appendChild(canvas);
		    canvas.className = "screenshot";
		    if(mode) {
				mode.cleanup();
			}

		    setTimeout(() => {
				const link = document.createElement('a');
				location.appendChild(link);
				link.setAttribute('download', name);
				link.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"));
				link.click();

				location.removeChild(canvas);
				location.removeChild(link);

				this.dispatch(new Event(Event.COMPLETE, this));
			}, 1);
		});
	}

	static fixResults() {
		document.body.style.overflow = "auto";
		const results = document.querySelector("results");
		results.style.height = "auto";
		results.style.width = "1000px";
		results.className = "screenshot";
		Screenshot.redrawGraphs();
		return results;
	}

	static fixSmallResults() {
		Screenshot.fixResults().className = "screenshot screenshot-small";
		Screenshot.redrawGraphs();
	}

	static redrawGraphs() {
		for(let i in window.simulator.charts) {
			if(window.simulator.charts[i].update) {
				window.simulator.charts[i].update();
			}
		}
	}

	static cleanResults() {
		document.body.style.overflow = "hidden";
		const results = document.querySelector("results");
		results.style.height = "calc(100vh - 69px)";
		results.style.width = "70%";
		results.className = "";
		Screenshot.redrawGraphs();
	}
}