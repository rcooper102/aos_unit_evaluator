import "./Loading.scss";

export class Loading extends Base {

	constructor() {
		super();
		this.make("loading");
		this.progress = 0;
	}

	set progress(target) {
		this._progress = target;
		this.text = Locale.gen("loading-message", { progress: `${Math.round(target*100)}` });
	}

	get progress() {
		return this._progress;
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}
}