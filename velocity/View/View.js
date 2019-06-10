import "./View.scss";

export class View extends Section {

	constructor(params) {
		super();
		this.addClass("View");
	}

	shutDown() {
		if(this.opacity !== 0) {
			this.opacity = 0;
			setTimeout(this.onShutDown.bind(this), 1000);
		}	
	}

	onShutDown() {
		this.dispatch(new Event(Event.SHUTDOWN, this));
		this.removeListener(TransitionEvent.COMPLETE, this.onShutDown);
		Body.removeChild(this);
	}

}