var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
    res.render('resources', {
    	resources : 'ibm-highlight',
    	user : req.user
    });
});

/*making it work */

module.exports = router;
