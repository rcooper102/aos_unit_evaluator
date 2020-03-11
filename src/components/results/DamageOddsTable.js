import { Utils } from "../../utils";
import { config } from "../../config.js";
import { ResultsTable } from "./ResultsTable";
import { NumberField } from "../../components/numberField/NumberField";

export class DamageOddsTable extends Base {

	constructor(data) {
		super();
		this.make("damage-odds-table");
		this.data = data;

		const graphTitle = new Header(4);
		graphTitle.text = Locale.gen("damage-odds-table-title");
		this.addChild(graphTitle);

		const graphSubTitle = new Paragraph();
		graphSubTitle.text = Locale.gen("damage-odds-table-sub-title");;
		this.addChild(graphSubTitle);

		const control = new Base();
		control.make("control");
		this.addChild(control);

		const controlLabel = new Label();
		controlLabel.text = Locale.gen("damage-odds-table-control");;
		control.addChild(controlLabel);

		this.input = new NumberField("", NumberField.TYPES.INTEGER, 10);
		control.addChild(this.input);

		this.tableDisplay = new ResultsTable();
		this.addChild(this.tableDisplay);

		this.input.value = this.damage = 1;
		this.input.addListener(Event.CHANGE, this.onChange, this);
	}

	update() {
		
	}

	onChange() {
		this.damage = this.input.valid ? this.input.value : null;
	}

	set damage(target) {
		this._damage = target;
		this.tableDisplay.data = this.table;	
	}

	get damage() {
		return this._damage || 1000000000000;
	}

	get table() {
		const saves = [''];
		const units = [];
		Object.keys(this.data).forEach((save) => {
			saves.push(`${save}+`);
			this.data[save].forEach((unit,i) => {
				if(!units[i]) {
					units[i] = [`<span style='color:${unit.data.color}'>${unit.data.name || Locale.gen("unit")}</span>`];
				}

				units[i][save-1] = Utils.formatPercent(this.generateOdds(unit, this.damage));
			});
		});

		return {
			rows: units,
			columns: saves,
		};
	}

	generateOdds(unit, damage) {
		let i = 0;
		const l = unit.results.length;
		let count = 0;
		for(i = 0; i < l; i++) {

			if(unit.results[i].total >= damage) {
				count ++;
			}
		}
		return count / l;
	}
}