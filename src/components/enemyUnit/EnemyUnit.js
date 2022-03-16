import { NumberField } from "../";
import { ToggleField } from "../buffEditor/ToggleField.js";
import { Utils } from "../../utils";
import "./EnemyUnit.scss";

export class EnemyUnit extends Base {

	static get FIELDS() {
		return {
			WOUNDS: 'wounds',
			INVULNERABLE: 'invulnerable',
			SHRUG: 'shrug',
		}
	}

	static get SCHEMA() {
		return [
			{
				name: EnemyUnit.FIELDS.WOUNDS,
				label: Locale.gen("enemy-unit-wounds"),
				title: Locale.gen("enemy-unit-wounds-title"),
				default: 1,
				size: 2
			},
			{
				name: EnemyUnit.FIELDS.INVULNERABLE,
				label: Locale.gen("enemy-unit-invulnerable"),
				title: Locale.gen("enemy-unit-invulnerable-title"),
				size: 1,
			},
			{
				name: EnemyUnit.FIELDS.SHRUG,
				label: Locale.gen("enemy-unit-shrug"),
				title: Locale.gen("enemy-unit-shrug-title"),
				size: 1,
			}
		];
	}

	constructor() {
		super();
		this.make("enemy-unit");
		this.build();
	}

	build() {
		this.fields = {};
		EnemyUnit.SCHEMA.forEach((item) => {
			this.header = new Header(4);
			this.header.text = item.label;
			this.addChild(this.header);

			this.field = new NumberField("", NumberField.TYPES.INTEGER, item.size);
			this.field.addListener(Event.CHANGE, this.onChange, this);
			this.addChild(this.field);
			if(item.default) {
				this.field.value = item.default;
			}
			if(item.title) {
				this.field.title = item.title;
				this.header.title = item.title;
			}

			this.fields[item.name] = this.field;
		});

		this.header = new Header(4);
		this.header.text = Locale.gen("enemy-unit-noSplash-mode");
		this.header.title = Locale.gen("enemy-unit-noSplash-mode-title");
		this.addChild(this.header);

		this.noSplash = new ToggleField()
		this.noSplash.addListener(Event.CHANGE, this.onChange, this);
		this.noSplash.title = Locale.gen("enemy-unit-noSplash-mode-title");
		this.addChild(this.noSplash);
		this.fields['noSplash'] = this.noSplash;
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE,this));
	}

	set value(target) {
		Object.keys(target).forEach((item) => {
			if(this.fields[item]){
				this.fields[item].value = target[item];
			}
		});
	}

	get value() {
		let ret = {};
		Object.keys(this.fields).forEach((item) => {
			ret[item] = this.fields[item].value;
		});
		return ret;
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}