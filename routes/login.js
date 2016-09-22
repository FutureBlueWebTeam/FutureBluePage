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
router.post('/', Auth.isLoggedOut, function(req, res, next){
    passport.authenticate('local-login', {
	successRedirect: req.session.redirectTo || "/",
	failureRedirect: '/login',
	failureFlash: true
    })(req, res, next);
});

module.exports = router;
