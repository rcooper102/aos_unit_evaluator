const html2Canvas = require("html2canvas");

export class Screenshot extends EventDispatcher {

	constructor (node, name = "screen.png") {
		super();

		const location = document.body;

		html2Canvas(node).then((canvas) => {
		    location.appendChild(canvas);

		    setTimeout(() => {
				const link = document.createElement('a');
				location.appendChild(link);
				link.setAttribute('download', name);
				link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
				link.click();

				location.removeChild(canvas);
				location.removeChild(link);
				this.dispatch(new Event(Event.COMPLETE, this));
			}, 1);
		});
	}
}