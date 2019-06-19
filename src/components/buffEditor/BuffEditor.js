import { Utils } from "../../utils";
import { Buff } from "../../models";
import { ModalWindow } from "../modalWindow/ModalWindow";
import { CheckField } from "./CheckField";
import "./BuffEditor.scss";

export class BuffEditor extends ModalWindow {

	static get FIELD_NAMES() {
		return {
			DICE: "dice",
		}
	}

	static get FIELD_TYPES() {
		return {
			CHECK_FIELD: CheckField,
		}
	}

	static get SCHEMAS() {
		return {
			[Buff.TYPES.REROLL]: {
				fields: [
					{
						label: Locale.gen("buff-reroll-dice"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.DICE,
					}
				],
				label: Locale.gen("buff-reroll-label"),
				description: Locale.gen("buff-reroll-description"),
				name: Locale.gen("buff-reroll-name"),
			}
		}
	}

	constructor() {
		super();
		this.fields = [];

		this.title = Locale.gen("buff-editor-title");

		this.editor = new Base();
		this.editor.make("editor");
		this.container.addChild(this.editor);

		this.navigation = new Base();
		this.navigation.make("navigation");
		this.container.addChild(this.navigation);

		this.container.addClass("buff-editor");

		Object.keys(BuffEditor.SCHEMAS).forEach((item) => {
			const btn = new Base();
			btn.make("buff-choice");
			btn.name = item;
			this.navigation.addChild(btn);
			btn.text = Locale.gen("buff-add", { name: BuffEditor.SCHEMAS[item].name });
			btn.addListener(MouseEvent.CLICK, this.onAdd, this);
		});
	}

	onAdd(e) {
		this.add(e.target.name);
	}

	add(name) {
		const field = new BuffEditorField(name);
		this.editor.addChild(field);
		this.fields.push(field);
		field.addListener(Event.CHANGE, this.onChange, this);
		return field;
	}

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE, this));
	}

	get value() {
		let ret = []
		this.fields.forEach((item) => {
			ret.push(item.value);
		});

		return ret;
	}

	set value(target) {
		target.forEach((item) => {
			const field = this.add(item[Object.keys(item)[0]].type);
			field.value = item;
		});
	}
}

class BuffEditorField extends Base {

	static get OPTIONS() {
		return {
			HIT: Locale.gen("buff-editor-field-hit"),
			WOUND: Locale.gen("buff-editor-field-wound"),
		};
	};

	constructor(schema) {
		super();
		this.make("buff-editor-field");
		this.data = BuffEditor.SCHEMAS[schema];
		this.schema = schema;
		this.fields = [];

		const title = new Header(3);
		title.text = this.data.name;
		this.addChild(title);

		this.options = new CheckField({ options: Object.keys(BuffEditorField.OPTIONS).map((i) => BuffEditorField.OPTIONS[i])});
		this.addChild(this.options);
		this.options.addListener(Event.CHANGE, this.onChange, this);

		this.data.fields.forEach((item) => {
			const label = new Header(4);
			label.text = item.label;
			this.addChild(label);

			const field = new item.type(item);
			this.addChild(field);
			this.fields.push(field);
			field.addListener(Event.CHANGE, this.onChange, this);
		});
	}

	onChange() {
		this.dispatch(new Event(Event.CHANGE, this));
	}

	get value() {
		const ret = {};
		this.options.value.forEach((item) => {
			Object.keys(BuffEditorField.OPTIONS).forEach((option) => {
				if(item === BuffEditorField.OPTIONS[option]) {
					ret[option.toLowerCase()] = this.generateValue();
				}
			});
		});

		return ret;
	}

	set value(target) {
		this.options.value = Object.keys(target).map((item) => BuffEditorField.OPTIONS[item.toUpperCase()]) || null;
		const val = target[Object.keys(target)[0]];
		if(this.fields.length === 1) {
			this.fields[0].value = val.data;
		} else {
			this.fields.forEach((field) => {
				Object.keys(val.data).forEach((key) => {
					if(field.data.name === key) {
						field.value = val.data[key];
					}
				});
			});
		}
	}

	generateValue() {	
		const buff = new Buff(this.schema);
		if(this.fields.length === 1) {
			buff.data = this.fields[0].value;
		} else {
			const data = {};
			this.fields.forEach((item) => {
				data[item.data.name] = item.value;
			});
			buff.data = data;
		}
		return buff;
	}
}