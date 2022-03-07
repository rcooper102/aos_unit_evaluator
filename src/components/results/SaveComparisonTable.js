import { Utils } from "../../utils";
import { config } from "../../config.js";
import { ResultsTable } from "./ResultsTable";

export class SaveComparisonTable extends Base {

	constructor(data) {
		super();
		this.make("save-comparison-table");
		this.data = data;


		this.tableDisplay = new ResultsTable();
		this.addChild(this.tableDisplay);
	}

	update() {
		this.tableDisplay.data = this.table;
	}

	get table() {
		const saves = [''];
		const units = [];
		Object.keys(this.data).forEach((save) => {
			saves.push(`${save}+`);
			this.data[save].forEach((unit,i) => {
				if(!units[i]) {
					units[i] = [`<span style='color:${unit.data.color}'>${Utils.generateName(unit.data)}</span>`];
				}
				units[i][save-1] = Math.round(unit.average*100)/100;
			});
		});

		return {
			rows: units,
			columns: saves,
		};
	}
}