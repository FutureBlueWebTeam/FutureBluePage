var express = require('express');
var DB = require('../config/DB.js');
var Utils = require('../config/Utils.js');
var router = express.Router();

/* GET about page. */
router.get('/:id', function(req, res, next) {
	DB.getUser(req.params.id, function(err, profile) {
		if (err) {
			Utils.renderError({ res : res, req : req, err : err });
		} else {
			DB.getPostsByUser(req.params.id, function(err, posts) {
				if (err) {
					Utils.renderError({ res : res, req : req, err : err });
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