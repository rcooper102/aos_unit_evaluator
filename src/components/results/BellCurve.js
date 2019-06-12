const Chart = require("chart.js");
const cloneDeep = require('clone-deep');

export class BellCurve extends Base {

	constructor(iterations) {
		super();
		this.make("bell-curve");
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

	normalize(data) {
		console.log(data);
	}

	get series() {
		this._series = [];
		this.normalize(this.data);
		this.data.forEach((unit) => {
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
				borderColor: unit.data.color });
		});
		return this._series;
	}
}