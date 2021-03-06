import { Utils } from "../../utils";

export class ResultsTable extends Base {

	constructor() {
		super();
		this.make("results-table");
	}

	set data(data) {
		this.text = `
			<table>
				<tr>
					${
						data.columns.map((item) => {
							return `<th>${item}</th>`;
						}).join("")
					}
				</tr>
				${

					data.rows.map((item,i) => {
						return `<tr>
							${
							item.map((cell,j) => {
								return `<td class="${ j === 0 ? 'name' : '' }">${cell}</td>`;
							}).join("")
						}</tr>`
					}).join("")
				}
			</table>
		`;
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}
	
}
