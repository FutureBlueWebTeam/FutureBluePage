var express = require('express');
var passport = require('passport');
var Auth = require('../config/Auth.js');

var router = express.Router();

require('../config/passport')(passport);

/* Render the login page. */
router.get('/', Auth.isLoggedOut, function(req, res, next) {
    res.render('login', {
    	login : "ibm-highlight",
    	message : req.flash('message'),
      	user : req.user
    });
});

/* Handles logging into the site */
router.post('/', Auth.isLoggedOut, passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

module.exports = router;
