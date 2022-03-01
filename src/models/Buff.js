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
				trigger: [5, 6], //Which dice rolls trigger the bonus attack. 
				output: "D3", //Dice notation of integer of how many attacks are triggered.
				stop: true, //Does triggering attacks wounds stop the attack sequence?
				autoHit: true,
			}
			**/
			TRIGGER_ATTACKS: "TRIGGER_ATTACKS",
			/**
			{
				trigger: [5, 6], //Which dice rolls trigger the rend 
				output: "D3", //Dice notation of integer of how much rend is triggered.
			}
			**/
			TRIGGER_REND: "TRIGGER_REND",
			/**
			{
				trigger: [5, 6], //Which dice rolls trigger the higher rend
				output: "D3", //Dice notation of integer of how much damage is triggered.
			}
			**/
			TRIGGER_DAMAGE: "TRIGGER_DAMAGE",
			/**
			{
				trigger: [6], //Which dice rolls trigger the auto wound
				Note: NO WOUND ROLL IS MADE.
			}
			**/
			TRIGGER_WOUND: "TRIGGER_WOUND",

		};
	}

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}