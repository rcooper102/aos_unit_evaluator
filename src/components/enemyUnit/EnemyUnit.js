import { NumberField } from "../";
import { ToggleField } from "../buffEditor/ToggleField.js";
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

		this.header = new Header(4);
		this.header.text = Locale.gen("enemy-unit-noSplash-mode");
		this.header.title = Locale.gen("enemy-unit-noSplash-mode-title");
		this.addChild(this.header);

		this.noSplash = new ToggleField()
		this.noSplash.addListener(Event.CHANGE, this.onChange, this);
		this.noSplash.title = Locale.gen("enemy-unit-noSplash-mode-title");
		this.addChild(this.noSplash);
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE,this));
	}

	set value(target) {
		if(target.wounds) {
			this.wounds.value = target.wounds || 1;
		}
		if(target.noSplash) {
			this.noSplash.value = target.noSplash || false;
		}
	}

	get value() {
		return {
			wounds: Number(this.wounds.value) || 1,
			noSplash: this.noSplash.value,
		};
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}