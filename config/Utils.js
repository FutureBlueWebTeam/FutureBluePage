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
    
    escapeHtml : function(unsafe) {
    var reverseCoded = unsafe
         .replace(/&amp;/g, "&")
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
         .replace(/&quot;/g, "\"")
         .replace(/&#039;/g, "'");
        
    return reverseCoded
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }
}

module.exports = Utils;
