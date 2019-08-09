import { Utils } from "../../utils";
import { ModalWindow } from "../modalWindow/ModalWindow";
import { config } from "../../config";
import "./UnitLoader.scss";

export class UnitLoader extends ModalWindow {

	
	constructor(units) {
		super();
		this.units = [];

		this.searchBox = new Input();
		this.windowHeader.addChild(this.searchBox);
		this.searchBox.obj.placeholder = Locale.gen("search-placeholder");
		this.searchBox.addListener(InputEvent.CHANGE, this.onSearch, this);
		this.searchBox.obj.focus();

		units.forEach((item) => { 
			const unit = new UnitLoaderItem(item);
			unit.addListener(Event.ACTIVATE, this.onActivate, this);
			unit.addListener(Event.CLEAR, this.onClear, this);
			this.units.push(unit);
		});

		this.empty = new Paragraph();
		this.empty.text = Locale.gen("unit-loader-empty");

		this.search();
	}

	onSearch(e) {
		this.search(this.searchBox.value);
	}

	search(term) {
		this.term = term ? term.toLowerCase() : null;
		this.container.text = "";
		let units = this.units;
		if(this.term) {
			units = units.filter(item => item.name.toLowerCase().indexOf(this.term) > -1);
		}
		units = units.sort((a,b) => a.name>b.name ? 1 : -1);
		units.forEach((item) => {
			this.container.addChild(item);
		});
		if(units.length === 0) {
			this.container.addChild(this.empty);
		}
	}

	onActivate(e) {
		this.dispatch(new Event(Event.ACTIVATE, e.target));
		this.shutDown();
	}

	onClear(e) {
		this.units = this.units.filter((item) => {
			if(item.name === e.target) {
				return false;
			}
			return true;
		});
		this.dispatch(new Event(Event.CLEAR, e.target));
		this.search(this.term);
	}

	
}

class UnitLoaderItem extends Base {

	constructor(name) {
		super();
		this.make("unit-loader-item");
		this.name = name;
		const label = new Base();
		label.make("label");
		label.text = name;
		this.addChild(label);
		label.addListener(MouseEvent.CLICK, this.onSelect, this);

		const remove = new Base();
		remove.make("remove");
		remove.text = Locale.gen("unit-delete");
		this.addChild(remove);
		remove.addListener(MouseEvent.CLICK, this.onRemove, this);
	}

	onSelect() {
		this.dispatch(new Event(Event.ACTIVATE, this.name));
	}

	onRemove() {
		this.dispatch(new Event(Event.CLEAR, this.name));
	}
}
