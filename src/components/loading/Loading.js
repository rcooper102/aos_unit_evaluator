import "./Loading.scss";

export class Loading extends Base {

	constructor() {
		super();
		this.make("loading");

		this.text = Locale.gen("loading-message");
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}
}