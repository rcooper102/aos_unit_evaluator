import { config } from "../../config.js";
const Chart = require("chart.js");

export class BellCurve extends Base {

	constructor() {
		super();
		this.make("bell-curve");

		this.container = new Base();
		this.container.make("canvas");
		this.addChild(this.container);
	}

	update(data) {
		this.data = data;

		console.log(this.series);

		var myChart = new Chart(this.container.obj.getContext('2d'), {
		    type: 'scatter',
		    data: { 
		    	datasets: this.series,
		  	},
		  	options: {
		  		responsive: true,
		  		animation: false,
		  		fill: false,
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
				        labelString: Locale.gen("bell-curve-percentage"),
				      }
				    }],
				    xAxes: [{
				      scaleLabel: {
				        display: true,
				        labelString: Locale.gen("bell-curve-damage"),
				      }
				    }]
				}
		    }
		});	
	}

	get series() {
		this._series = [];
		this.data.forEach((unit) => {
			const curve = [];
			Object.keys(unit.curve).forEach((i) => {
				curve.push({
					x: Number(i),
					y: Math.round(unit.curve[i] / config.simulator.iterations*100),
				});
			});
			this._series.push({ 
				showLine: true,
				label: unit.data.name,
				data: curve,
				backgroundColor: unit.data.color,
				fill: false,
				borderColor: unit.data.color });
		});
		return this._series;
	}
}