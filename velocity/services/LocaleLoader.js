export class LocaleLoader extends EventDispatcher {

	constructor(locales) {
		super();

		this.locales = locales;
		this.selectedLocale = Cookies.get("locale");
		this.targetLocale = null;

		/** If set in the cookie, load that lang, if not try to load the browser's lang, if not, default to first in list **/
		if(this.locales.indexOf(this.selectedLocale) !== -1) {
			this.load(this.selectedLocale);
		} else if (this.locales.indexOf(window.navigator.language.split("-")[0]) !== -1) {
			this.load(window.navigator.language.split("-")[0]);
		} else {
			this.load(this.locales[0]);
		}
	}

	load(target) {
		this.targetLocale = target;
		let loader = new Ajax(`/application/project/ui/assets/locale/${target}.json`);
		loader.method = Ajax.methods.GET;
		loader.addListener(AjaxEvent.COMPLETE, this.onLoad, this);
		loader.send({});
	}

	onLoad(e) {
		Locale.add(this.targetLocale, e.data);
		this.dispatch(new Event(Event.COMPLETE), this);
	}
}