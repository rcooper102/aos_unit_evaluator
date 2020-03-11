import { Unit } from "../";
import { config } from "../../config.js";
import { UnitLoader } from "../unitLoader/UnitLoader.js";
import { DataManager } from "../dataManager/DataManager.js";
import { User } from "../../services/";
import "./SimConfig.scss";

export class SimConfig extends Base {

	constructor() {
		super();
		this.make("sim-config");
		this.build();
		window.sim = this;
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

		if(User.hasFeature(User.FEATURES.SAVE_UNITS)) {
			this.loadButton = new Base();
			this.loadButton.make("button");
			this.loadButton.text = Locale.gen("sim-config-load-unit");
			this.loadButton.addListener(MouseEvent.CLICK, this.onLoadUnit, this);

			this.saveButton = new Base();
			this.saveButton.make("button");
			this.saveButton.text = Locale.gen("sim-config-save-unit");
			this.saveButton.addListener(MouseEvent.CLICK, this.onSaveUnit, this);
		}

		this.controls = new Base();
		this.controls.make('controls');

		this.disclaimer = new Base();
		this.disclaimer.make("description");
		this.disclaimer.text = Locale.gen("sim-config-disclaimer");
		this.disclaimer.addClass("disclaimer");

		if(User.hasFeature(User.FEATURES.MANAGE_DATA)) {
			this.manage = new Base();
			this.manage.make("manage");
			this.manage.text = Locale.gen("sim-config-manage");
			this.manage.addListener(MouseEvent.CLICK, this.onManageData, this);
		}

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
		this.addChild(this.controls);
		if(this.units.length > config['max-units'] - 1) {
			if(this.createButton.obj.parentNode) {
				this.controls.removeChild(this.createButton)
			}
			if(this.loadButton && this.loadButton.obj.parentNode) {
				this.controls.removeChild(this.loadButton)
			}
		} else {
			this.controls.addChild(this.createButton);
			if(this.loadButton && this.localSaves.length > 0) {
				this.controls.addChild(this.loadButton);
			}
		}
		this.addChild(this.disclaimer);
		if(this.manage) {
			this.addChild(this.manage);
		}
	}

	onUnitDelete(e) {
		e.target.shutDown();
		this.units = this.units.filter((item) => e.target !== item);
		this.onUnitChange();
		this.refreshAddButton();	
	}

	onUnitChange(e, displaySave = true) {
		const data = this.value;
		history.pushState(null, null, `#${this.encodedData}`);
		if(this.saveButton && displaySave && this.valid){
			this.controls.addChild(this.saveButton);
		}
		this.dispatch(new Event(Event.CHANGE, this));
	}

	onSaveUnit() {
		this.saveToLocal();
	}

	get encodedData() {
		return btoa(JSON.stringify(this.value));
	}

	get localData() {
		return btoa(JSON.stringify(localStorage));
	}

	importLocalData(target, reset=false) {
		if(reset) { 
			const key = localStorage['AOS_SIM_KEY'];
			localStorage.clear();
			localStorage['AOS_SIM_KEY'] = key;
		};
		const broken = target.split(".");
		if(broken[broken.length - 1] === "txt") {
			let loader = new TextLoader();
			loader.addListener(DataEvent.LOAD, (e) => {
				this.mergeLocalData(e.data);
			}, this);
			loader.load(`${config['data-source']}${target}`);
		} else {
			this.mergeLocalData(target);
		}
	}

	mergeLocalData(target) {
		const d = JSON.parse(atob(target));
		Object.keys(d).forEach((i) => {
			localStorage[i] = d[i];
		});
		this.dispatch(new Event(Event.LOAD,this));
	}


	saveToLocal() {	
		this.value.forEach((item) => {
			if(item.name.trim() && item.valid) {
				localStorage[this.generateLocalName(item.name)] = JSON.stringify(item);
			}
		});

		this.dispatch(new Event(Event.CHANGE, this));
		this.refreshAddButton();
		if(this.saveButton) {
			this.controls.removeChild(this.saveButton);
		}
	}

	onManageData() {
		new DataManager();
	}

	generateLocalName(target) {
		return `aos|${target.toLowerCase()}`;
	}

	loadLocal(target) {
		const name = this.generateLocalName(target);
		if(localStorage[name]) {
			this.addUnit(JSON.parse(localStorage[this.generateLocalName(target)]));
			this.onUnitChange(null, false);
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

	get hasLocalPoints() {
		for(let i = 0; i<this.localSaves.length;i++) {
			if(JSON.parse(localStorage[this.generateLocalName(this.localSaves[i])]).points) {
				return true;
			}
		}
		return false;
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