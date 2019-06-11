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
		const appName = new Header(3);
		appName.text = Locale.gen("sim-config-title");
		this.addChild(appName);

		this.createButton = new Base();
		this.createButton.make("button");
		this.createButton.text = Locale.gen("sim-config-add-unit");
		this.createButton.addListener(MouseEvent.CLICK, this.onAddUnit, this);

		this.units = [];

		if(this.data.length === 0) {
			this.addUnit();
		} else {
			this.data.forEach((item) => {
				this.addUnit(item);
			});
		}

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
		unit.addListener(Event.DELETE, this.onUnitDelete, this);

		if(this.units.length > config['max-units'] - 1) {
			if(this.createButton.obj.parentNode) {
				this.removeChild(this.createButton)
			}
		} else {
			this.addChild(this.createButton);
		}

		return unit;
	}

	onUnitDelete(e) {
		e.target.shutDown();
		this.units = this.units.filter((item) => e.target !== item);
		this.onUnitChange();	
	}

	onUnitChange(e) {
		const data = this.value;
		if(this.value.length > 0) {
			window.location.hash = btoa(JSON.stringify(this.value));
		}
	}

	get value() {
		return this.units
			.filter((item) => item.valid)
			.map((item) => item.value);
	}

}