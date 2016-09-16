var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/public-transit', function(req, res, next) {
    res.render('toronto/public-transit', {
    	user : req.user
    });
});
router.get('/housing', function(req, res, next) {
    res.render('toronto/housing', {
    	user : req.user
    });
});
/*router.get('/thing-to-do', function(req, res, next) {
    res.render('toronto/thing-to-do', {
    	user : req.user
    });
}); */
router.get('/restaurants', function(req, res, next) {
    res.render('toronto/restaurants', {
    	user : req.user
    });
});

router.get('/', function(req, res, next) {
    res.redirect('/resources');
});


module.exports = router;
