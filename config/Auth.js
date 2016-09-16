var express = require('express');
var router = express.Router();

/*
	This file contains methods for user authentication
*/

var Auth = {
	isLoggedOut : function(req, res, next) {
		if (!req.user) {
			next();
		} else {
			res.redirect('/');
		}
	},
	isLoggedIn : function(req, res, next) {
		if (req.user) {
			next();
		} else {
            req.session.redirectTo = req.originalUrl;
			res.redirect('/login');
		}
	},
	isAdmin : function(req, res, next) {
		if (req.user && req.user.accountType === "Admin") {
			next();
		} else {
            req.session.redirectTo = req.originalUrl;
			res.redirect('/login');
		}
	},
	isBlogger : function(req, res, next) {
		if (req.user && (req.user.accountType === "Blogger" || req.user.accountType === "Admin")) {
			next();
		} else {
            req.session.redirectTo = req.originalUrl;
			res.redirect('/login');
		}
	},
	isMember : function(req, res, next) {
		if (req.user && req.user.accountType === "Member") {
			next();
		} else {
            req.session.redirectTo = req.originalUrl;
			res.redirect('/login');
		}
	},
	isAlumni : function(req, res, next) {
		if (req.user && req.user.accountType === "Alumni") {
			next();
		} else {
            req.session.redirectTo = req.originalUrl;
			res.redirect('/login');
		}
	},
	isBanned : function(req, res, next) {
		if (req.user && req.user.accountType === "Banned") {
			next();
		} else {
            req.session.redirectTo = req.originalUrl;
			res.redirect('/login');
		}
	}
}

module.exports = Auth;