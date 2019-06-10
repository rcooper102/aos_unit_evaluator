import { LocaleLoader } from "./services/LocaleLoader.js";

export class VelocityApplication extends Router {
	
	constructor(config) {
		super(config.routes);
		this.config = config;
		this.localeLoader = new LocaleLoader(config.locales);
		this.localeLoader.addListener(Event.COMPLETE, this.onLocale, this);
	}

	onLocale(e) {
		this.enable();
	}

	setLocale(target) {
		Cookies.set("locale", target);
		window.location.reload();		
	}
}