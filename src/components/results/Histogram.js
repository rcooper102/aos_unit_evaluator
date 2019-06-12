import { Utils } from "../../utils";
const Chart = require("chart.js");
const cloneDeep = require('clone-deep');

export class Histogram extends Base {

	constructor(iterations, highestDamage) {
		super();
		this.make("histogram");
		this.iterations = iterations;
		this.container = new Base();
		this.container.make("canvas");
		this.addChild(this.container);
		this.highestDamage = highestDamage;
	}

	update(data) {
		this.data = data;
		var myChart = new Chart(this.container.obj.getContext('2d'), {
		    type: 'scatter',
		    data: { 
		    	datasets: this.series,
		  	},
		  	options: {
		  		bezierCurve : false,
		  		responsive: true,
		  		animation: false,
		  		fill: true,
		  		elements: {
                    point:{
                        radius: 1
                    }
                },
		  		tooltips: {
		  			enabled: false,
		  		},
			    legend: {
			    	display: false,
			    },
			    scales: {
				    yAxes: [{
				      scaleLabel: {
				        display: false,
				        labelString: Locale.gen("histogram-percentage"),
				      },
				      ticks: {
						    callback: (value) => { 
						        return `${value}%`;
						    },
						    display: false,
						    beginAtZero: true,
						    steps: 10,
						    stepValue: 10,
                            max: 100,
						},
				    }],
				    xAxes: [{
				      scaleLabel: {
				        display: true,
				        labelString: Locale.gen("histogram-damage"),
				      },
				      ticks: {
						    beginAtZero: true,
						    steps: 5,
						    stepValue: Math.round(this.highestDamage/5),
                            max: this.highestDamage,
						},
				    }]
				}
		    }
		});	
	}

	/*
		Ensures that all curves share all the same damage points.
		Any curve that is missing a damage point that one of the others has zeroes it out.
	*/
	normalize(data) {
		const newData = cloneDeep(data);
		let highest = 0;
		newData.forEach((item) => {
			Object.keys(item.curve).forEach((damage) => {
				damage = Number(damage);
				if(damage > highest) {
					highest = damage;
				}
			});
		});
		newData.forEach((item) => {
			for(let i = 0; i < highest+1; i++) {
				if(!item.curve[i]) {
					item.curve[i] = 0;
				}
			}
		});
		return newData;
	}

	get series() {
		this._series = [];
		this.normalize(this.data).forEach((unit) => {
			const curve = [];
			Object.keys(unit.curve).forEach((i) => {
				curve.push({
					x: Number(i),
					y: Math.round(unit.curve[i] / this.iterations*100),
				});
			});
			this._series.push({ 
				showLine: true,
				label: unit.data.name,
				data: curve,
				backgroundColor: Utils.hexToRGB(unit.data.color, 0.2),
				lineTension: 0.3,
				borderWidth: 2,
				borderColor: unit.data.color });
		});
		return this._series;
	}
}