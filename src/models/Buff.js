export class Buff {

	static get TYPES() {
		return {
			REROLL: "REROLL",
		};
	}

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}