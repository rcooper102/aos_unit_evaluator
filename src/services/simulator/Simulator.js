import { config } from "../../config.js";
import { SaveLevelSimulator } from "./SaveLevelSimulator.js";
import { Utils } from "../../utils";
const cloneDeep = require('clone-deep');

export class Simulator extends EventDispatcher {

	constructor(data, iterations) {
		super();
		this.config = config.simulator;
		this.data = this.normalizePoints(data);
		this.results = {};
		this.completed = 0;
		this.progress = {};
		this.highest = 0;
		this.config.saves.forEach((item) => {
			const save = new SaveLevelSimulator(this.data, item, iterations);
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
		let highestPoints = 0;
		let lowestPoints = 0;
		data.forEach((item) => {
			if(!item.points) {
				canNormalize = false;
			} else {
				const points = Number(item.points);
				highestPoints =points > highestPoints ? points : highestPoints;
				lowestPoints = points < lowestPoints || !lowestPoints ? points : lowestPoints;
			}
		});
		let normalized = false;
		if (highestPoints/lowestPoints < 5 && highestPoints !== lowestPoints) {
			if(highestPoints % lowestPoints !== 0) {
				highestPoints = highestPoints * 5;
			}
			normalized = true;
		}
		if(!canNormalize) {
			return data;
		} else {
			const newData = cloneDeep(data);
			newData.forEach((item) => {
				const ratio = highestPoints / item.points;
				item.attacks.forEach((attack) => {
					attack['number'] = Utils.multiplyDiceValue(attack['number'], ratio);
					item['normalizedPoints'] = normalized ? highestPoints : null;
				});
			});
			return newData;
		}
	}

}