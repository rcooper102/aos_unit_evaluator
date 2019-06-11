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
};