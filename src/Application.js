require("../velocity/utils/scss/reset.css");
import "./Application.scss";


import { config } from "./config.js";
import { VelocityApplication } from "../velocity/VelocityApplication.js";
 
var app;

class Application extends VelocityApplication {	
	constructor() {
		super(config);
	}	
}

Window.addListener(WindowEvent.LOAD, (e) => { app = new Application(); }, {});




