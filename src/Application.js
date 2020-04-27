require("../velocity/utils/scss/reset.css");
import "./Application.scss";


import { config } from "./config.js";
import { VelocityApplication } from "../velocity/VelocityApplication.js";
import { User, Screenshot } from "./services";
 
var app;

class Application extends VelocityApplication {	
	constructor() {
		super(config);
		this.user = new User();
		window.simulator = {
			screen: Screenshot,
			charts: {

			}
		}
	}	

}

Window.addListener(WindowEvent.LOAD, (e) => { app = new Application(); }, {});




