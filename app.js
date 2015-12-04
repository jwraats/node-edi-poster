var util = require('util');
var Client = require('node-rest-client').Client;

client = new Client();
var urlZWAVE 	= "http://127.0.0.1:8083/ZAutomation/api/v1/";
var urlEDIAPI 	= "http://145.48.6.95:8080/api/";
var config = {
	usernameEDI: "ediuser",
	passwordEDI: "edipassword",
	usernameZWAVE: "admin",
	passwordZWAVE: "admin"
};


var EDIAPI = {
	createToken: function(username, password, callback, args){
		client.post(urlEDIAPI+"login", {
			data: {
				"username": username,
				"password": password
			}, 
			headers:{
				"Content-Type": "application/json"
			}
		}, function(data,response){
			var objData = JSON.parse(data);
			if(objData.token !== undefined){
				callback(objData.token, args);
			}else{
				return false;
			}
		});
	},
	addMeasurement: function(token, args){
		if(token !== undefined){
			client.post(urlEDIAPI+"measurements", {
				data: {
					"SensorDeviceidentifier": args.sdID,
					"Value": args.value,
					"MeasurementUnit": args.measurementUnit
				}, 
				headers:{
					"Content-Type": "application/json",
					"X-Access-Token": token
				}
			}, function(data,response){
				var objData = JSON.parse(data);
				if(objData.status === "OK"){
					console.log("Measurement added: "+util.inspect(args));
				}else{
					console.log("Measurement not correct added: "+util.inspect(args));
				}
			});
		}else{
			if(EDIAPI.createToken(config.usernameEDI, config.passwordEDI, EDIAPI.addMeasurement, args)){
				console.log("Token not working :( :( ");
			}
		}
	}
};

var ZWAVE = {
	createCookie: function(username, password, callback, args){
		//JAMIE!!!
		client.post(urlZWAVE+"login", {
			data: {
				"form": true,
				"login": username,
				"password": password,
				"keepme": false,
				"default_ui": 1
			}, 
			headers:{
				"Content-Type": "application/json"
			}
		}, function(data,response){
			if(response.headers !== undefined && response.headers['set-cookie'] !== undefined){
				callback(response.headers['set-cookie'][0], args);
			}else{
				console.log("No Cookie is set... ");
			}
		});

	},
	getDevices: function(cookie, args){
		if(cookie !== undefined){
			client.get(urlZWAVE+"devices", {
				headers:{
					"Content-Type": "application/json",
					"Cookie": cookie
				}
			}, function(data, response){
				var objData = JSON.parse(data);
				if(objData.data !== undefined && objData.data.devices !== undefined && objData.data.devices.length !== 0){
					var devices = objData.data.devices;
					devices.forEach(function(item){
						//Fibaro Metering Wall Plug
						if(item['deviceType'] === 'sensorMultilevel'){
							EDIAPI.addMeasurement(undefined, {
								"sdID": item['id'],
								"value": item['metrics']['level'],
								"measurementUnit": item['metrics']['scaleTitle']
							});
						}
					});
				}
			});
		}else{
			if(ZWAVE.createCookie(config.usernameZWAVE, config.passwordZWAVE, ZWAVE.getDevices, args)){
				console.log("Token not working :( :( ");
			}
		}
	}

};

ZWAVE.getDevices();