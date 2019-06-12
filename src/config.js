import { Combat } from "./views/combat/Combat.js";

const ITERATIONS = 2000;

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
		iterations: ITERATIONS,
	},
	"bell-curve": {
	  showPoint: false,
	  lineSmooth: true,
	  axisX: {
	    showGrid: true,
	    showLabel: true
	  },
	  axisY: {
	  	showLabel: true,
	  	labelInterpolationFnc: (value) => {
	      return `${Math.round(value/ITERATIONS*100)}%`;
	    }
	  },
	},
};