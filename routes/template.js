var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    res.render('Northstar Template', {
    	about : 'ibm-highlight', // Adds the 'ibm-highlight' class to the about nav button
    	user : req.user
    });
});

module.exports = router;