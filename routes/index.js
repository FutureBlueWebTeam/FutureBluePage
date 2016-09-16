var express = require('express');
var DB = require('../config/DB.js');
var Utils = require('../config/Utils.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	DB.getRecentPosts(6, function(err, recentPosts) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});

			return;
		}

		res.render('index', {
	    	index : 'active', // Adds the 'active' class to the Home nav button
	    	user : req.user,
	    	recentPosts : recentPosts
	    });
	});
});

module.exports = router;
