export class Buff {

	static get TYPES() {
		return {
			/**
				[
					1, 2, 3
				]
			**/
			REROLL: "REROLL",
			/**
			{
				trigger: [5, 6], //Which dice rolls trigger the mortal wound. 
				output: "D3", //Dice notation of integer of how many mortal wounds are caused.
				stop: true, //Does triggering mortal wounds stop the attack sequence?
			}
			**/
			TRIGGER_MORTAL: "TRIGGER_MORTAL",
			/**
			{
				trigger: [5, 6], //Which dice rolls trigger the mortal wound. 
				output: "D3", //Dice notation of integer of how many mortal wounds are caused.
				stop: true, //Does triggering mortal wounds stop the attack sequence?
				autoHit: true,
			}
			**/
			TRIGGER_ATTACKS: "TRIGGER_ATTACKS",
		};
	}

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}