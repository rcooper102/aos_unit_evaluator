import { Utils } from "../../utils";
import { Buff } from "../../models";
import { ModalWindow } from "../modalWindow/ModalWindow";
import { CheckField } from "./CheckField";
import { ToggleField } from "./ToggleField";
import { InputField } from "./InputField";
import { config } from "../../config";
import "./BuffEditor.scss";

export class BuffEditor extends ModalWindow {

	static get FIELD_NAMES() {
		return {
			DICE: "dice",
			STOP: "stop",
			TRIGGER: "trigger",
			OUTPUT: "output",
			VIRULENCE: "virulence",
			AUTO_HIT: "autoHit",
		}
	}

	static get FIELD_TYPES() {
		return {
			CHECK_FIELD: CheckField,
			TOGGLE_FIELD: ToggleField,
			INPUT_FIELD: InputField,
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
			},
			[Buff.TYPES.TRIGGER_MORTAL]: {
				fields: [
					{
						label: Locale.gen("buff-trigger-mortal-trigger"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.TRIGGER,
					},
					{
						label: Locale.gen("buff-trigger-mortal-output"),
						type: BuffEditor.FIELD_TYPES.INPUT_FIELD,
						diceNotation: true,
						name: BuffEditor.FIELD_NAMES.OUTPUT,
					},
					{
						label: Locale.gen("buff-trigger-mortal-stop"),
						type: BuffEditor.FIELD_TYPES.TOGGLE_FIELD,
						name: BuffEditor.FIELD_NAMES.STOP,
					}
				],
				label: Locale.gen("buff-trigger-mortal-label"),
				description: Locale.gen("buff-trigger-mortal-description"),
				name: Locale.gen("buff-trigger-mortal-name"),
			},
			[Buff.TYPES.TRIGGER_DAMAGE]: {
				fields: [
					{
						label: Locale.gen("buff-trigger-damage-trigger"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.TRIGGER,
					},
					{
						label: Locale.gen("buff-trigger-damage-output"),
						type: BuffEditor.FIELD_TYPES.INPUT_FIELD,
						diceNotation: true,
						name: BuffEditor.FIELD_NAMES.OUTPUT,
					},
				],
				label: Locale.gen("buff-trigger-damage-label"),
				description: Locale.gen("buff-trigger-damage-description"),
				name: Locale.gen("buff-trigger-damage-name"),
			},
			[Buff.TYPES.TRIGGER_WOUND]: {
				fields: [
					{
						label: Locale.gen("buff-trigger-wound-trigger"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.TRIGGER,
					},
				],
				hitOnly: true,
				label: Locale.gen("buff-trigger-wound-label"),
				description: Locale.gen("buff-trigger-wound-description"),
				name: Locale.gen("buff-trigger-wound-name"),
			},
			[Buff.TYPES.TRIGGER_REND]: {
				fields: [
					{
						label: Locale.gen("buff-trigger-rend-trigger"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.TRIGGER,
					},
					{
						label: Locale.gen("buff-trigger-rend-output"),
						type: BuffEditor.FIELD_TYPES.INPUT_FIELD,
						diceNotation: true,
						name: BuffEditor.FIELD_NAMES.OUTPUT,
					},
				],
				label: Locale.gen("buff-trigger-rend-label"),
				description: Locale.gen("buff-trigger-rend-description"),
				name: Locale.gen("buff-trigger-rend-name"),
			},
			[Buff.TYPES.TRIGGER_DISEASE]: {
				fields: [
					{
						label: Locale.gen("buff-trigger-disease-trigger"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.TRIGGER,
					},
					{
						label: Locale.gen("buff-trigger-disease-output"),
						type: BuffEditor.FIELD_TYPES.INPUT_FIELD,
						diceNotation: true,
						name: BuffEditor.FIELD_NAMES.OUTPUT,
					},
					{
						label: Locale.gen("buff-trigger-disease-virulence"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.VIRULENCE,
					},
				],
				label: Locale.gen("buff-trigger-disease-label"),
				description: Locale.gen("buff-trigger-disease-description"),
				name: Locale.gen("buff-trigger-disease-name"),
			},
			[Buff.TYPES.TRIGGER_ATTACKS]: {
				fields: [
					{
						label: Locale.gen("buff-trigger-attacks-trigger"),
						type: BuffEditor.FIELD_TYPES.CHECK_FIELD,
						options: [1,2,3,4,5,6],
						name: BuffEditor.FIELD_NAMES.TRIGGER,
					},
					{
						label: Locale.gen("buff-trigger-attacks-output"),
						type: BuffEditor.FIELD_TYPES.INPUT_FIELD,
						diceNotation: true,
						name: BuffEditor.FIELD_NAMES.OUTPUT,
					},
					{
						label: Locale.gen("buff-trigger-attacks-stop"),
						type: BuffEditor.FIELD_TYPES.TOGGLE_FIELD,
						name: BuffEditor.FIELD_NAMES.STOP,
					},
					{
						label: Locale.gen("buff-trigger-attacks-autohit"),
						type: BuffEditor.FIELD_TYPES.TOGGLE_FIELD,
						name: BuffEditor.FIELD_NAMES.AUTO_HIT,
					}
				],
				label: Locale.gen("buff-trigger-attacks-damage"),
				description: Locale.gen("buff-trigger-attacks-description"),
				name: Locale.gen("buff-trigger-attacks-name"),
			}
		};
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
		field.addListener(Event.CLEAR, this.onDelete, this);
		this.onChange();
		return field;
	}

	onDelete(e) {
		this.fields = this.fields.filter((item) => item !== e.target);
		this.onChange();
	};

	onChange(e) {
		this.dispatch(new Event(Event.CHANGE, this));
		if(this.fields.length >= config['max-buffs']) {
			this.navigation.style.display = "none";
		} else {
			this.navigation.style.display = "block";
		}
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
			if(Object.keys(item)[0]) {
				const field = this.add(item[Object.keys(item)[0]].type);
				field.value = item;
			}
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

		const del = new Base()
		del.make("delete");
		del.text = "X";
		this.addChild(del);
		del.addListener(MouseEvent.CLICK, this.onDelete, this);

		const desc = new Paragraph();
		desc.text = this.data.description;
		this.addChild(desc);

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

		this.checkForHitOnly();
	}

	checkForHitOnly() {
		if(this.data.hitOnly) {
			this.options.value = [BuffEditorField.OPTIONS.HIT];
			this.options.obj.style.display = "none";
		}
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
		if(this.fields.length === 1 && !this.data.hitOnly) {
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
		this.checkForHitOnly();
	}

	generateValue() {	
		const buff = new Buff(this.schema);
		if(this.fields.length === 1 && !this.data.hitOnly) {
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

	onDelete() {
		this.dispatch(new Event(Event.CLEAR, this));
		this.shutDown();
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}
}