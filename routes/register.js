var express = require('express');
var passport = require('passport');
var Auth = require('../config/Auth.js');

var router = express.Router();

require('../config/passport')(passport);

/* Render the register page. */
router.get('/', Auth.isLoggedOut, function(req, res, next) {
    res.render('register', {
    	register : "ibm-highlight",
    	message : req.flash('message'),
      	user : req.user
    });
});

/* Handles registering for the site */
router.post('/', Auth.isLoggedOut, passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/register',
	failureFlash: true
}));

module.exports = router;
