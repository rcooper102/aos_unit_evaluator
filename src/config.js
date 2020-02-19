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
	"max-units": 5,
	"max-buffs": 3,
	"simulator": {
		saves: [2,3,4,5,6,7],
		"default-save": 5,
		iterations: [30000, 10000, 5000],
		"default-iterations": 5000,
	},
	"all-sim": {
		save: 4,
		iterations: 5000,
		normalize: 5000,
	},	
	"hide-point-threshold": 40,
	"data-source": `https://raw.githubusercontent.com/rcooper102/aos_unit_eval_data/master/`,
	"data-source-all": 'all.txt',
	"key": "cd85e31af71eee31ff5ced372546aa70",
};