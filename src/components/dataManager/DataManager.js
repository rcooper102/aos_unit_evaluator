import { Utils } from "../../utils";
import { ModalWindow } from "../modalWindow/ModalWindow";
import { config } from "../../config";
import "./DataManager.scss";

export class DataManager extends ModalWindow {

	
	constructor() {
		super();
		this.addClass('data-manager');

		this.title = Locale.gen('data-manager-title');

		const intro = new Paragraph();
		intro.text = Locale.gen('data-manager-intro');
		this.container.addChild(intro);
		
		const copyData = new Base();
		copyData.make('copy');
		copyData.text = Locale.gen('data-manager-copy');
		this.container.addChild(copyData);
		copyData.addListener(MouseEvent.CLICK, this.onCopy, this);

		this.import = new Input();
		this.container.addChild(this.import);
		this.import.obj.focus();

		const importData = new Base();
		importData.make('import');
		importData.text = Locale.gen('data-manager-import');
		this.container.addChild(importData);
		importData.addListener(MouseEvent.CLICK, this.onImport, this);

		const clearData = new Base();
		clearData.make('clear');
		clearData.text = Locale.gen('data-manager-clear');
		this.container.addChild(clearData);
		clearData.addListener(MouseEvent.CLICK, this.onClear, this);
	}

	onCopy() {
		try {
			navigator.clipboard.writeText(window.sim.localData);
		} catch (e) {
			console.error("copy failed", e);
		}
	}

	onImport() {
		if(this.import.value) {
			window.sim.addListener(Event.LOAD, () => {
				window.location.reload();
			});
			window.sim.importLocalData(this.import.value, this.import.value === config['data-source-all']);	
			this.shutDown();
		}
	}

	onClear() {
		const key = localStorage['AOS_SIM_KEY'];
		localStorage.clear();
		localStorage['AOS_SIM_KEY'] = key;
		window.location.reload();
	}

	
	
}

