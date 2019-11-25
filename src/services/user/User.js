import { config } from "../../config.js";

export class User extends EventDispatcher {

	static get FEATURES() {
		return {
			SAVE_UNITS: { name: "SAVE_UNITS", level: 1 },
			MANAGE_DATA: { name: "MANAGE_DATA", level: 1 },
		}
	}

	constructor () {
		super();
		const urlParams = new URLSearchParams(window.location.search);
		if(urlParams.get("key")) {
			localStorage['AOS_SIM_KEY'] = urlParams.get("key");
		}
	}

	static get userLevel() {
		return localStorage['AOS_SIM_KEY'] === config.key ? 1 : 0;
	}

	static hasFeature(feature) {
		return User.FEATURES[feature.name] && User.userLevel >= User.FEATURES[feature.name].level;
	}
}