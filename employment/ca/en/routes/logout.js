var express = require('express');
var Auth = require('../config/Auth.js');
var Utils = require('../config/Utils');
var router = express.Router();

router.get('/', Auth.isLoggedIn, function(req, res) {
    req.logout();
    res.redirect(Utils.getFullPath() + 'login');
});

module.exports = router;