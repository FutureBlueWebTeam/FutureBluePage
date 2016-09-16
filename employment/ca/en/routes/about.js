var express = require('express');
var Utils = require('../config/Utils');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    res.render('about', {
    	about : 'ibm-highlight', // Adds the 'ibm-highlight' class to the about nav button
    	user : req.user,
    	rootPath : Utils.ROOT_PATH
    });
});

module.exports = router;
