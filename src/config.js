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
	"simulator": {
		saves: [2,3,4,5,6,7],
		"default-save": 4,
		iterations: [30000, 10000, 5000, 1000],
	},	
};