import { Utils } from "../../utils";
import { config } from "../../config.js";
import { AttackBuffSummary } from "../unit/attack/Attack";
import { Screenshot } from "../../services";

export class ResultsHeader extends Base {

	constructor(iterations, rolls) {
		super();
		this.make("results-header");

		this.iterations = iterations;
		this.rolls = rolls;
	}

	onSave() {
		new Screenshot(Screenshot.MODES.RESULTS);
	}

	update(data, save) {
		this.text = "";

		let btn = new Base();
		btn.make("button");
		btn.text = Locale.gen("results-header-save-image");
		this.addChild(btn);
		btn.addListener(MouseEvent.CLICK, this.onSave, this);

		let results = new Div();
		this.addChild(results);

		results.text = `
			<h3>${ Locale.gen("results-title", { iterations: this.iterations }) }</h3>
			<rolls>${ Locale.gen("results-sub-title", { rolls: this.rolls }) }</rolls>
			<info>
				<summary>
					<ul>
					${
						data.map((item) => this.renderUnit(item.data)).join("")
					}
					</ul>
				</summary>
				<save>${ Locale.gen("results-header-target-save", {save: save}) }</save>
			</info>
		`;
	}

	renderUnit(data) {
		return `
		<li>
			<name style='color:${data.color}'>${data.name} ${ data.points ? Locale.gen("results-header-points", {points: data.points}) : "" }</name>
			<attacks>
				${ data.attacks.map((item) => this.renderAttacks(item)).join("") }
			</attacks>
		</li>`
	}

	renderAttacks(data) {
		let buffs;
		if(data.buffs) {
			buffs = new AttackBuffSummary();
			buffs.data = data.buffs;
		}

		return `<attack>
			<profile>${
				Locale.gen("results-header-attack", data)
			}</profile>
			<buffs>
			${ data.buffs ? buffs.text : "" }
			</buffs>
		</attack>`;
	}
}