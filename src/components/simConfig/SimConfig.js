import { Unit } from "../";
import { config } from "../../config.js";
import "./SimConfig.scss";

export class SimConfig extends Base {

	constructor() {
		super();
		this.make("sim-config");
		this.build();
	}

	build() {
		const title = new Header(3);
		title.text = Locale.gen("sim-config-title");
		this.addChild(title);

		const description = new Base();
		description.make("description");
		description.text = Locale.gen("sim-config-description");
		this.addChild(description);

		this.createButton = new Base();
		this.createButton.make("button");
		this.createButton.text = Locale.gen("sim-config-add-unit");
		this.createButton.addListener(MouseEvent.CLICK, this.onAddUnit, this);

		this.disclaimer = new Base();
		this.disclaimer.make("description");
		this.disclaimer.text = Locale.gen("sim-config-disclaimer");
		this.disclaimer.addClass("disclaimer");

		this.units = [];

		if(this.data.length === 0) {
			this.addUnit();
		} else {
			this.data.forEach((item) => {
				this.addUnit(item);
			});
			setTimeout(() => {
				this.dispatch(new Event(Event.ACTIVATE, config.simulator['default-iterations']));
			},1);
		}

		this.onUnitChange();
	}

	onAddUnit() {
		this.addUnit();
		this.onUnitChange();
	}

	get data() {
		if(!this._data) {
			this._data = [];
			try {
				if(window.location.hash) {
					this._data = JSON.parse(atob(window.location.hash.substr(1)));
					return this._data;
				}
			} catch (e) {
				console.error("Unable to parse url data");
				window.location.hash = "";
				return [];
			}
		}
		return this._data;
	}

	addUnit(value = null) {
		const unit = new Unit();
		this.addChild(unit);
		this.units.push(unit);
		unit.value = value;
		unit.addListener(Event.CHANGE, this.onUnitChange, this);
		unit.addListener(Event.REMOVE, this.onUnitDelete, this);

		this.refreshAddButton();

		return unit;
	}

	refreshAddButton() {
		if(this.units.length > config['max-units'] - 1) {
			if(this.createButton.obj.parentNode) {
				this.removeChild(this.createButton)
			}
		} else {
			this.addChild(this.createButton);
		}
		this.addChild(this.disclaimer);
	}

	onUnitDelete(e) {
		e.target.shutDown();
		this.units = this.units.filter((item) => e.target !== item);
		this.onUnitChange();
		this.refreshAddButton();	
	}

	onUnitChange(e) {
		const data = this.value;
		history.pushState(null, null, `#${this.encodedData}`);
		this.saveToLocal();
		this.dispatch(new Event(Event.CHANGE, this));
	}

	get encodedData() {
		return btoa(JSON.stringify(this.value));
	}


	saveToLocal() {	
		if(!this.localDebounce) {
			Window.addListener(WindowEvent.FRAME, this.onSaveToLocal, this);
		}
		this.localDebounce = 1;
	}

	onSaveToLocal() {
		this.localDebounce ++;
		if(this.localDebounce > 100) {
			this.localDebounce = null;
			Window.removeListener(WindowEvent.FRAME, this.onSaveToLocal);

			const names = this.value.map(item => item.name);
			for(let i = 0; i<names.length;i++) {
				if(trim(names[i]) === "") {
					return;
				}
			}
			localStorage[this.generateLocalName(names.join(", ")] = `${new Date().getTime()}|${this.encodedData}`;
		}
	}

	generateLocalName(target) {
		return `aos|${target}`;
	}

	loadLocal(target) {
		const name = this.generateLocalName(target);
		if(localStorage[name]) {
			history.pushState(null, null, `#${localStorage[name].split("|")[1]}`);
			window.location.reload();
		}
	}

	get value() {
		return this.units
			.map((item) => item.value);
	}

	get valid() {
		let valid = !!this.units.length;
		this.units.forEach((item) => { 
			if(!item.valid) {
				valid = false;
			}
		});
		return valid;
	}

}