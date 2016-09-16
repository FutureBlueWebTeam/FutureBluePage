var express = require('express');
var router = express.Router();
var DB = require('../config/DB.js');
var Utils = require('../config/Utils');

var PAGE_SIZE = 10;

/* GET gallery page. */
router.get('/', function(req, res, next) {
    DB.getPhotos(function(err, photos) {
        if (err) {
          Utils.renderError({ res : res, req : req, err : err });
          return;
        }

        res.render('gallery', {
            gallery : 'ibm-highlight', // Adds the 'ibm-highlight' class to the about nav button
            user : req.user,
            photos : photos.slice(0, PAGE_SIZE),
            totalNumPhotos : photos.length,
            canShowMore : photos.length > PAGE_SIZE
        });
    });
});

router.post('/', function(req, res, next) {
    var page = req.body.page ? req.body.page : 0;
    var numToShow = page * PAGE_SIZE + PAGE_SIZE;

    DB.getPhotos(function(err, photos) {
        if (err) {
          Utils.renderError({ res : res, req : req, err : err });
          return;
        }

        var slicedPhotos = photos.slice(page * PAGE_SIZE, numToShow);

        res.send({ 
            photos : slicedPhotos,
            totalNumPhotos : photos.length,
            canShowMore : photos.length > numToShow
        });
    });
});

module.exports = router;