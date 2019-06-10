import { Attacks } from "../";
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

		this.units = [];

		if(this.data.length === 0) {
			this.addUnit();
		} else {
			this.data.forEach((item) => {
				this.addUnit(item);
			});
		}

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
		const attacks = new Attacks();
		this.addChild(attacks);
		this.units.push(attacks);
		attacks.value = value;
		attacks.addListener(Event.CHANGE, this.onUnitChange, this);
		return attacks;
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