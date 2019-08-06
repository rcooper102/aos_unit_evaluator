import { Unit } from "../";
import { config } from "../../config.js";
import { UnitLoader } from "../unitLoader/UnitLoader.js";
import "./SimConfig.scss";

export class SimConfig extends Base {

	constructor() {
		super();
		this.make("sim-config");
		this.build();
		window.simConfig = this;
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

		this.loadButton = new Base();
		this.loadButton.make("button");
		this.loadButton.text = Locale.gen("sim-config-load-unit");
		this.loadButton.addListener(MouseEvent.CLICK, this.onLoadUnit, this);

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
			if(this.loadButton.obj.parentNode) {
				this.removeChild(this.loadButton)
			}
		} else {
			this.addChild(this.createButton);
			if(this.localSaves.length > 0) {
				this.addChild(this.loadButton);
			}
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
		if(e){
			this.saveToLocal();
		}
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

			this.value.forEach((item) => {
				if(item.name.trim()) {
					localStorage[this.generateLocalName(item.name)] = JSON.stringify(item);
				}
			});

			this.refreshAddButton();
		}
	}

	generateLocalName(target) {
		return `aos|${target.toLowerCase()}`;
	}

	loadLocal(target) {
		const name = this.generateLocalName(target);
		if(localStorage[name]) {
			this.addUnit(JSON.parse(localStorage[this.generateLocalName(target)]));
		}
	}

	onLoadUnit() {
		const loader = new UnitLoader(this.localSaves);
		loader.addListener(Event.ACTIVATE, this.onLoadUnitComplete, this);
		loader.addListener(Event.CLEAR, this.onLoadUnitRemove, this);
	}

	onLoadUnitComplete(e) {
		this.loadLocal(e.target);
	}

	onLoadUnitRemove(e) {
		localStorage.removeItem(this.generateLocalName(e.target));
	}

	get localSaves() {
		return Object.keys(localStorage).filter((item) => {
			const name = item.split(this.generateLocalName(""));
			return name.length > 1;
		}).map((item) => {
			return item.split(this.generateLocalName(""))[1];
		});
	}

	get value() {
		return this.units.map((item) => item.value);
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