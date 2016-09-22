var express = require('express');
var router = express.Router();

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
    
    escapeHtml = function(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }
}

module.exports = Utils;
