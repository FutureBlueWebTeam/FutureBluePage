var express = require('express');
var router = express.Router();

/* GET calendar page. */
router.get('/', function(req, res, next) {
    res.render('calendar', {
    	resources : 'active',
    	user : req.user
    });
});

module.exports = router;
