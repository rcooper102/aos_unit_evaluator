import { Utils } from "../../utils";
import { ModalWindow } from "../modalWindow/ModalWindow";
import { config } from "../../config";
import "./UnitLoader.scss";

export class UnitLoader extends ModalWindow {

	
	constructor(units) {
		super();
		this.units = [];

		units.forEach((item) => { 
			const unit = new UnitLoaderItem(item);
			unit.addListener(Event.ACTIVATE, this.onActivate, this);
			unit.addListener(Event.CLEAR, this.onClear, this);
			this.units.push(unit);
			this.container.addChild(unit);
		});
	}

	onActivate(e) {
		this.dispatch(new Event(Event.ACTIVATE, e.target));
		this.shutDown();
	}

	onClear(e) {
		this.units.filter((item) => {
			if(item.name === e.target) {
				this.container.removeChild(item);
				return false;
			}
			return true;
		});
		this.dispatch(new Event(Event.CLEAR, e.target));
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
