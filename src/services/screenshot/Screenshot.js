const html2Canvas = require("html2canvas");

export class Screenshot extends EventDispatcher {

	static get MODES() {
		return  {
			RESULTS: { query: "results", fix: Screenshot.fixResults, cleanup: Screenshot.cleanResults },
		};
	}

	constructor (mode, name = "screen.jpg") {
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

		    setTimeout(() => {
				const link = document.createElement('a');
				location.appendChild(link);
				link.setAttribute('download', name);
				link.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"));
				link.click();

				location.removeChild(canvas);
				location.removeChild(link);

				if(mode) {
					mode.cleanup();
				}

				this.dispatch(new Event(Event.COMPLETE, this));
			}, 1);
		});
	}

	static fixResults() {
		document.body.style.overflow = "auto";
		document.querySelector("results").style.height = "auto";
	}

	static cleanResults() {
		document.body.style.overflow = "hidden";
		document.querySelector("results").style.height = "calc(100vh - 69px)";
	}
}