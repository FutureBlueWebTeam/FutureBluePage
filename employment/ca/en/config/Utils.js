var express = require('express');
var cfenv = require('cfenv');
var router = express.Router();
var appEnv = cfenv.getAppEnv();

/*
	This file contains global helper functions
*/

var Utils = {
	isEmpty : function(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	},

	getErrorMessage : function(err) {
		console.log(err);
		var escErr = err.toString().replace(/</g, "&lt;")
   								   .replace(/>/g, "&gt;")

		return 'It looks like something didn\'t go as planned. Contact Tom Fischer or Christina Isaicu with the following error:<br><br><b>' + escErr + '</b>';
	},

	getThumbnailPath : function(path) {
		var parts = path.split(".");
		var thumbnail = path;

		if (parts.length > 1) {
			parts[parts.length - 2] += "_thumb";
			thumbnail = parts.join(".");
		}

		return thumbnail;
	},

	renderError : function(args) {
		args.res.render('error', {
			user : args.req.user,
			title : args.title ? args.title : 'Something went wrong...',
			message : args.message ? args.message : this.getErrorMessage(args.err),
			icon : args.icon ? args.icon : 'remove'
        });
	},

	getFullPath : function() {
		return '//localhost:' + appEnv.port + this.ROOT_PATH
	},

	ROOT_PATH : '/'

}

module.exports = Utils;
