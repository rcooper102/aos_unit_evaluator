import { Utils } from "../../utils";
import { config } from "../../config.js";
const Chart = require("chart.js");
const cloneDeep = require('clone-deep');

export class Histogram extends Base {

	constructor(iterations, highestDamage) {
		super();
		this.make("histogram");
		this.iterations = iterations;

		const graphTitle = new Header(4);
		graphTitle.text = Locale.gen("histogram-title");
		this.addChild(graphTitle);

		const graphSubTitle = new Paragraph();
		graphSubTitle.text = Locale.gen("histogram-sub-title");;
		this.addChild(graphSubTitle);

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
		  		maintainAspectRatio: false,
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
                            min: 0,
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
			const conf = {
				showLine: true,
				backgroundColor: Utils.hexToRGB(unit.data.color, 0.2),
				lineTension: 0.3,
				borderWidth: 2,
				borderColor: unit.data.color,
				pointRadius: Object.keys(unit.curve).length > config['hide-point-threshold'] ? 0 : 1,
			};

			const curve = [];
			Object.keys(unit.curve).forEach((i) => {
				curve.push({
					x: Number(i),
					y: Math.round(unit.curve[i] / this.iterations*100),
				});
			});
			this._series.push({ 
				...conf,
				label: unit.data.name,
				data: curve,
			});
			this._series.push({ 
				...conf,
				label: unit.data.name,
				data: [{x:unit.average, y:0},{x:unit.average, y:100}],
				borderColor:  Utils.hexToRGB(unit.data.color, 0.4),
				pointRadius: 0,
				borderWidth: 1,
			});
		});
		return this._series;
	}
}