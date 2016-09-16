var express = require('express');
var Utils = require('../config/Utils');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    res.render('resources', {
    	resources : 'ibm-highlight',
    	user : req.user
    });
});

module.exports = router;
