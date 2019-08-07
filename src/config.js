import { Combat } from "./views/combat/Combat.js";



export let config = {
	"container": "unit-evaluator",
	"locales": ["en"],
	"routes": [
		{
			path: "",
			depth: [0,1],
			view: Combat
		}
	],
	"max-units": 3,
	"max-buffs": 3,
	"simulator": {
		saves: [2,3,4,5,6,7],
		"default-save": 5,
		iterations: [30000, 10000, 5000, 1000],
		"default-iterations": 5000,
	},
	"all-sim": {
		save: 4,
		iterations: 6000,
		normalize: 5000,
	},	
	"hide-point-threshold": 40,
};