var express = require('express');
var Utils = require('./Utils.js');
var router = express.Router();

/*
	This file contains methods for user authentication
*/

var Auth = {
	isLoggedOut : function(req, res, next) {
		if (!req.user) {
			next();
		} else {
			res.redirect(Utils.getFullPath());
		}
	},
	isLoggedIn : function(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect(Utils.getFullPath() + 'login');
		}
	},
	isAdmin : function(req, res, next) {
		if (req.user && req.user.accountType === "Admin") {
			next();
		} else {
			res.redirect(Utils.getFullPath() + 'login');
		}
	},
	isBlogger : function(req, res, next) {
		if (req.user && (req.user.accountType === "Blogger" || req.user.accountType === "Admin")) {
			next();
		} else {
			res.redirect(Utils.getFullPath() + 'login');
		}
	},
	isMember : function(req, res, next) {
		if (req.user && req.user.accountType === "Member") {
			next();
		} else {
			res.redirect(Utils.getFullPath() + 'login');
		}
	},
	isAlumni : function(req, res, next) {
		if (req.user && req.user.accountType === "Alumni") {
			next();
		} else {
			res.redirect(Utils.getFullPath() + 'login');
		}
	},
	isBanned : function(req, res, next) {
		if (req.user && req.user.accountType === "Banned") {
			next();
		} else {
			res.redirect(Utils.getFullPath() + 'login');
		}
	}
}

module.exports = Auth;