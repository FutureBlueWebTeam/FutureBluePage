var express = require('express');
var DB = require('../config/DB.js');
var Utils = require('../config/Utils.js');
var router = express.Router();

/* GET about page. */
router.get('/:id', function(req, res, next) {
	DB.getUser(parseInt(req.params.id), function(err, profile) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
		} else {
			DB.getPostsByUser(parseInt(req.params.id), function(err, posts) {
				if (err) {
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					res.render('user', {
				    	user : req.user,
				    	profile : profile,
				    	posts : posts
				    });
				}
			});
		}
	});
});

module.exports = router;