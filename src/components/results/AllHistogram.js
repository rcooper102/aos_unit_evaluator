import { Utils } from "../../utils";
import { config } from "../../config.js";
const Chart = require("chart.js");
const cloneDeep = require('clone-deep');

export class AllHistogram extends Base {

	constructor() {
		super();
		this.make("histogram");

		const graphTitle = new Header(4);
		graphTitle.text = Locale.gen("all-histogram-title");
		this.addChild(graphTitle);

		const graphSubTitle = new Paragraph();
		graphSubTitle.text = Locale.gen("all-histogram-sub-title");;
		this.addChild(graphSubTitle);

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
				        display: false
				      },
				    }]
				}
		    }
		});	
	}

	get series() {
		const curve = {};
		let total = 0;
		this.data.forEach((item) => {
			const score = Math.round(item.score/10)*10;
			if(!curve[score]) {
				curve[score] = 0;
			}
			curve[score] ++;
			total += score;
		});

		this._series = [];

		const conf = {
			showLine: true,
			backgroundColor: Utils.hexToRGB("#333", 0.2),
			lineTension: 0.3,
			borderWidth: 2,
			borderColor: "#333",
			pointRadius: 0,
			label: "",
		};

		const bell = [{x:0,y:0}];
		Object.keys(curve).forEach((i) => {
			bell.push({
				x: Number(i),
				y: curve[i],
			});
		});
		this._series.push({ 
			...conf,
			data: bell,
		});

		const avg = total / this.data.length
		this._series.push({ 
			...conf,
			data: [{x:avg, y:0},{x:avg, y:100}],
			borderColor:  Utils.hexToRGB("#333", 0.4),
			pointRadius: 0,
			borderWidth: 1,
		});

		return this._series;
	}
}