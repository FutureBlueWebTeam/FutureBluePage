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
		}
	},
	isAdmin : function(req, res, next) {
		if (req.user && req.user.accountType === "Admin") {
			next();
		} else {
			res.redirect('/login');
		}
	},
	isBlogger : function(req, res, next) {
		if (req.user && (req.user.accountType === "Blogger" || req.user.accountType === "Admin")) {
			next();
		} else {
			res.redirect('/login');
		}
	},
	isMember : function(req, res, next) {
		if (req.user && req.user.accountType === "Member") {
			next();
		} else {
			res.redirect('/login');
		}
	},
	isAlumni : function(req, res, next) {
		if (req.user && req.user.accountType === "Alumni") {
			next();
		} else {
			res.redirect('/login');
		}
	},
	isBanned : function(req, res, next) {
		if (req.user && req.user.accountType === "Banned") {
			next();
		} else {
			res.redirect('/login');
		}
	}
}

module.exports = Auth;