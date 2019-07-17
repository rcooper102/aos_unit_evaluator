import { Utils } from "../../utils";
import { config } from "../../config.js";
const Chart = require("chart.js");
const cloneDeep = require('clone-deep');

export class SaveComparison extends Base {

	constructor(data) {
		super();
		this.make("histogram");
		this.data = data;

		const graphTitle = new Header(4);
		graphTitle.text = Locale.gen("save-comparison-title");
		this.addChild(graphTitle);

		const graphSubTitle = new Paragraph();
		graphSubTitle.text = Locale.gen("save-comparison-sub-title");;
		this.addChild(graphSubTitle);

		this.container = new Base();
		this.container.make("canvas");
		this.addChild(this.container);
	}

	update() {
		var myChart = new Chart(this.container.obj.getContext('2d'), {
		    type: 'scatter',
		    data: { 
		    	datasets: this.series,
		  	},
		  	options: {
		  		bezierCurve : true,
		  		responsive: true,
		  		maintainAspectRatio: false,
		  		animation: false,
		  		fill: false,
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
				        display: true,
				        labelString: Locale.gen("save-comparison-damage"),
				      },
				      ticks: {
						    display: true,
						    beginAtZero: true
						},
				    }],
				    xAxes: [{
				      scaleLabel: {
				        display: true,
				        labelString: Locale.gen("save-comparison-save"),
				      },
				      ticks: {
				      		callback: e => {
				      			return Number.isInteger(e) ? `${Math.round(e)}+` : "";
				      		},
				        }
				    }]
				}
		    }
		});	
	}


	get series() {
		let series = {}
		Object.keys(this.data).forEach((save) => {
			this.data[save].forEach((unit,i) => {
				if(!series[unit.data.color]) {
					const conf = {
						showLine: true,
						backgroundColor: "rgba(0,0,0,0)",
						lineTension: 0.3,
						borderWidth: 2,
						borderColor: unit.data.color,
						pointRadius: 2,
					};
					series[unit.data.color] = {
						...conf,
						label: unit.data.name,
						data: [],
					}
				}
				series[unit.data.color].data.push({
					x: save,
					y: unit.average,
				});
				
			});
			
		});
		this._series = Object.keys(series).map((item) => series[item]);
		return this._series;
	}
}