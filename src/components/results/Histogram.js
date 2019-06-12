const Chart = require("chart.js");
const cloneDeep = require('clone-deep');

export class Histogram extends Base {

	constructor(iterations) {
		super();
		this.make("histogram");
		this.iterations = iterations;
		this.container = new Base();
		this.container.make("canvas");
		this.addChild(this.container);
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
		  		fill: false,
		  		elements: {
                    point:{
                        radius: 2
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
				        display: true,
				        labelString: Locale.gen("histogram-percentage"),
				      },
				      ticks: {
						    callback: (value) => { 
						        return `${value}%`;
						    },
						    beginAtZero: true
						},
				    }],
				    xAxes: [{
				      scaleLabel: {
				        display: true,
				        labelString: Locale.gen("histogram-damage"),
				      }
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
				backgroundColor: unit.data.color,
				fill: false,
				lineTension: 0.3,
				borderWidth: 2,
				borderColor: unit.data.color });
		});
		return this._series;
	}
}