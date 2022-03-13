import { NumberField } from "../";
import { Utils } from "../../utils";
import "./EnemyUnit.scss";

export class EnemyUnit extends Base {

	static get DEFAULT_WOUNDS() {
		return 1;
	}

	constructor() {
		super();
		this.make("enemy-unit");
		this.build();
	}

	build() {
		this.header = new Header(4);
		this.header.text = Locale.gen("enemy-unit-wounds");
		this.addChild(this.header);

		this.wounds = new NumberField("", NumberField.TYPES.INTEGER, 1);
		this.wounds.addListener(Event.CHANGE, this.onChange, this);
		this.addChild(this.wounds);
		this.wounds.value = EnemyUnit.DEFAULT_WOUNDS;
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE,this));
	}

	set value(target) {
		if(target.wounds) {
			this.wounds.value = target.wounds || 1;
		}
	}

	get value() {
		return {
			wounds: Number(this.wounds.value) || 1
		};
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}