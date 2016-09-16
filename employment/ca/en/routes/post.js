var express = require('express');
var DB = require('../config/DB.js');
var Utils = require('../config/Utils.js');
var router = express.Router();

/* GET post page. */ 
router.get('/:id', function(req, res, next) {
	DB.getPost(req.params.id, function(err, post, categories) {
		if (err) {
			Utils.renderError({ res : res, req : req, err : err });
			return;
		}

		DB.getRecentPosts(5, function(err, recentPosts) {
			if (err) {
				Utils.renderError({ res : res, req : req, err : err });
				return;
			}

			res.render('post', {
				user : req.user,
				post : post,
				recentPosts : recentPosts,
				categories : categories
			});
		});
	});
});

module.exports = router;