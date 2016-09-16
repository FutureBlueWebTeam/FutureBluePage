var express = require('express');
var DB = require('../config/DB.js');
var Utils = require('../config/Utils.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	DB.getRecentPosts(6, function(err, recentPosts) {
		if (err) {
			Utils.renderError({ res : res, req : req, err : err });
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
