var express = require('express');
var Auth = require('../config/Auth.js');
var router = express.Router();

router.get('/', Auth.isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;