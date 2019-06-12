export class Utils {

	static isInteger(target) {
		return !!target.match(/^[0-9]*$/)
	}

	static isDiceNotation(target) {
		if (/^[\d+]?d\d+[\+|\-]?\d*$/.test(target.toLowerCase())) {
			return true;
		}
		return false;
	}

	static rollDice(dice = "d6") {
		dice = dice.toLowerCase();
		if (!Utils.isDiceNotation(dice)) { //Regex validate
			return 0; //Return if input invalid
		}

		if(dice[0]=="d") { //If the first character is a d (dY)
			dice = "1"+dice; //Add a 1
		}
		var minus = dice.search(/\-/); //Search for minus sign

		if (minus == -1 && dice.search(/\+/) == -1) { //If no minus sign and no plus sign (XdY)
			dice += '+0'; //Add a +0
		}
		if (minus == -1) { //If no minus sign (XdY+Z)
			var dicesplit = dice.split('+'); //Split for plus sign
			var modifier = dicesplit[1] * 1; //Number to add to total
		} else { //If there is a minus sign (XdY-Z)
			var dicesplit = dice.split('-'); //Split for minus sign
			var modifier = ("-" + dicesplit[1]) * 1; //Number to add to total
		}

		var diesplit = dicesplit[0].split('d'); //Take the first section (XdY) and split for d
		var howmany = diesplit[0] * 1; //Number of dice to roll
		var diesize = diesplit[1] * 1; //How many sides per die
		var total = 0; //Total starts as 0

		for (var i = 0; i < howmany; i++) { //Loop a number of times equal to the number of dice
			total += Math.floor(Math.random() * diesize) + 1; //Random number between 1 and diesize
		}
		total += modifier; //Add the modifier

		return total; //Return the final total
	}

	static generateRandomColor() {
		// NOTE extremely low and high values are not present to avoid extreme values
		const letters = '23456789ABC';
		let color = '#';
		for (let i = 0; i < 3; i++) {
			color += letters[Math.floor(Math.random() * letters.length)];
		}
		return color;
	}

	static bigNumberFormat(x) {
		if(isNaN(x)) return x;
		if(x < 9999) { return x; }
		if(x < 1000000) { return Math.round(x/1000) + "K"; }
		if( x < 10000000) {	return (x/1000000).toFixed(2) + "M"; }
		if(x < 1000000000) { return Math.round((x/1000000)) + "M";	}
		if(x < 1000000000000) {	return Math.round((x/1000000000)) + "B"; }
		return x;
	}

}