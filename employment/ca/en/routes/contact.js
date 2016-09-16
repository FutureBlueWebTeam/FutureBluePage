var express = require('express');
var Utils = require('../config/Utils');
var router = express.Router();

/* GET contact page. */
router.get('/', function(req, res, next) {
    res.render('contact', {
    	contact : 'ibm-highlight', // Adds the 'ibm-highlight' class to the about nav button
    	user : req.user
    });
});

module.exports = router;
