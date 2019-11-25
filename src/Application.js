require("../velocity/utils/scss/reset.css");
import "./Application.scss";


import { config } from "./config.js";
import { VelocityApplication } from "../velocity/VelocityApplication.js";
import { User } from "./services";
 
var app;

class Application extends VelocityApplication {	
	constructor() {
		super(config);
		this.user = new User();
	}	
}

Window.addListener(WindowEvent.LOAD, (e) => { app = new Application(); }, {});




