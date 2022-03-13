import { config } from "../../config.js";
import { SaveLevelSimulator } from "./SaveLevelSimulator.js";
import { Utils } from "../../utils";
const cloneDeep = require('clone-deep');

export class Simulator extends EventDispatcher {

	constructor(data, iterations) {
		super();
		Utils.resetRollCount();
		this.config = config.simulator;
		this.units = this.normalizePoints(data.units);
		this.results = {};
		this.completed = 0;
		this.progress = {};
		this.highest = 0;
		this.config.saves.forEach((item) => {
			const save = new SaveLevelSimulator(this.units, item, iterations,data.enemyUnit);
			save.addListener(Event.COMPLETE, this.onComplete, this);
			save.addListener(Event.PROGRESS, this.onProgress, this);
			this.progress[item] = 0;
		});
	}

	onProgress(e) {
		this.progress[e.target.save] = e.target.progress;
		let total = 0
		Object.keys(this.progress).forEach((i) => {
			total += this.progress[i];
		});
		this.dispatch(new Event(Event.PROGRESS, total/Object.keys(this.progress).length));
	}

	onComplete(e) {
		this.completed ++;
		if(e.target.highestDamage > this.highest) {
			this.highest = e.target.highestDamage;
		}
		this.results[e.target.save] = e.target.results;
		if(this.completed === this.config.saves.length) {
			this.dispatch(new Event(Event.COMPLETE, { results: this.results, highestDamage: this.highest }));
		}
	}

	normalizePoints(data) {
		let canNormalize = true;
		const points = [];
		data.forEach((item) => {
			item['normalizedRatio'] = 1;
			if(!item.points || data.length === 1) {
				canNormalize = false;
			} else {
				points.push(+(item.points));
			}
		});
		const normalizedPoint = Utils.lowestCommonMultiple(points);		
		if(!canNormalize) {
			return data;
		} else {
			const newData = cloneDeep(data);
			newData.forEach((item) => {
				const ratio = normalizedPoint / item.points;
				item.attacks.forEach((attack) => {
					item['normalizedPoints'] = normalizedPoint ? normalizedPoint : null;
					item['normalizedRatio'] = ratio;
				});
			});

			return newData;
		}
	}

}