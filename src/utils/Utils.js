let rolls = 0;

export class Utils {

	static generateName (data) {
		if(data['normalizedRatio'] && data['normalizedRatio'] > 1){
			return `${data['name'] || Locale.gen("Unit")} (${data['normalizedRatio']})`;
		}
		return data['name'] || Locale.gen("Unit");
	}

	static isInteger(target) {
		const val = target && target.trim ? target.trim() : target;
		return !!val && !!Number.isInteger(+val);
	}

	static isDiceNotation(target) {
		if(Utils.isInteger(target)) {
			return true;
		}
		if (/^[\d+]*d\d+[\+|\-]?\d*$/i.test(String(target))) {
			return true;
		}
		return false;
	}

	static rollDice(dice = "d6") {
		dice = String(dice).toLowerCase();
		if (!Utils.isDiceNotation(dice)) { //Regex validate
			return 0; //Return if input invalid
		}
		if(Utils.isInteger(dice)) {
			return +(dice);
		}

		let modifier = 0;
		let diceSplit = [dice];
		if (dice.indexOf("-") !== -1) { //If no minus sign (XdY+Z)
			diceSplit = dice.split('-'); //Split for plus sign
			modifier = -(diceSplit[1]); //Number to add to total
		} else if(dice.indexOf("+") !== -1) { //If there is a minus sign (XdY-Z)
			diceSplit = dice.split('+'); //Split for minus sign
			modifier = +(diceSplit[1]); //Number to add to total
		}

		const dieSplit = diceSplit[0].split('d'); //Take the first section (XdY) and split for d
		const howMany = dieSplit[0] ? +(dieSplit[0]) : 1; //Number of dice to roll
		const dieSize = +(dieSplit[1]); //How many sides per die
		let total = 0; //Total starts as 0
		rolls += howMany;

		let i;
		for (i = 0; i < howMany; i++) { //Loop a number of times equal to the number of dice
			total += Math.floor(Math.random() * dieSize) + 1; //Random number between 1 and diesize
		}

		return total + modifier; //Return the final total
	}

	static get rollCount() {
		return rolls;
	}

	static resetRollCount() {
		rolls = 0;
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
		if(isNaN(x)) return '';
		if(typeof x !== "string" && typeof x !== "number") return '';
		if(typeof x === "string" && x.trim() === '') return '';
		x = Number(x);
		if(x < 9999) { return String(x); }
		if(x <= 1000000) { return Math.round(x/1000) + "K"; }
		if( x <= 10000000) {	return (x/1000000).toFixed(2) + "M"; }
		if(x <= 1000000000) { return Math.round((x/1000000)) + "M";	}
		if(x <= 1000000000000) {	return Math.round((x/1000000000)) + "B"; }
		return x;
	}

	static commaNumberFormat(x) {
		if(!x) { return ''; }
	    x = typeof x === "string" || typeof x === "number" ? `${x}` : "";
	    const pattern = /(-?\d+)(\d{3})/;
	    while (pattern.test(x))
	        x = x.replace(pattern, "$1,$2");
	    return x;
	}

	static hexToRGB(hex, alpha) {
		if(typeof hex !== 'string') {
			hex = '#000';
		}
		if(hex.substr(0,1) === "#") {
			hex =hex.substr(1);
		}
	    let r = parseInt(hex.substr(0, 1)+"0", 16),
	        g = parseInt(hex.substr(1, 1)+"0", 16),
	        b = parseInt(hex.substr(2, 1)+"0", 16);

	    if (alpha) {
	        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	    } else {
	        return "rgb(" + r + ", " + g + ", " + b + ")";
	    }
	}

	static formatPercent(target) {
		if(typeof target !== 'number') {
			return '';
		}
		return `${Math.round(target*1000)/10}%`;
	}

	static multiplyDiceValue (target, ratio) {
		if(typeof ratio === 'number') {
			if(Utils.isDiceNotation(target)) {
				ratio = Math.round(ratio);
				const broken = String(target).toLowerCase().split("d");
				broken[0] = broken[0] === "" ? 1 : broken[0];
				broken[0] = Math.round(broken[0] * ratio);
				return broken.join("d");
			} else if(Utils.isInteger(target)) {
				return Math.round(target * ratio);
			}
		}
		return '';
	}

	static lowestCommonMultiple	(target) {
		if(!Array.isArray(target) || target.length === 0) {
			return 0;
		}
		for(let i = 0; i<target.length; i++) {
			if(typeof target[i] !== "number" || !Number.isInteger(target[i])) {
				return 0;
			}
		}
    	let numbers = target.sort();
    	let common = 0;
    	let failed = numbers;
    	while(failed.length > 0) {
    		common += numbers[0];
    		failed = numbers.filter((item) => common < item || common % item !== 0);
    	}
    	return common;
	}

}