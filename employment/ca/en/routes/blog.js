var express = require('express');
var knex = require('../config/knex.js');
var DB = require('../config/DB.js');
var Utils = require('../config/Utils.js');
var router = express.Router();

/* GET blog page. */
router.get('/', function(req, res, next) {
	var page = req.query.page !== undefined && req.query.page >= 0 ? req.query.page - 1 : 0;
  var numPerPage = req.query.show !== undefined && parseInt(req.query.show) >= 0 ? parseInt(req.query.show) : 10;
  var category = req.query.category !== undefined ? req.query.category : 'All';

  DB.getCategories(function(err, categories) {
    if (err) {
      Utils.renderError({ res : res, req : req, err : err });
      return;
    }

    DB.getPosts(category, null, function(err, posts) {
      if (err) {
        Utils.renderError({ res : res, req : req, err : err });
        return;
      }

      var postList = posts.slice(page * numPerPage, page * numPerPage + numPerPage);
      var startPostIndex = page * numPerPage + 1;
      var endPostIndex = page * numPerPage + postList.length;

      endPostIndex = endPostIndex > posts.length ? posts.length : endPostIndex;

      res.render('blog', {
        blog : 'ibm-highlight',
        user : req.user,
        page : page + 1,
        totalPages : Math.ceil(posts.length / numPerPage),
        numPerPage : numPerPage,
        category : category,
        categories : categories,
        posts : postList,
        totalNumPosts : posts.length,
        startPostIndex : endPostIndex < startPostIndex ? endPostIndex : startPostIndex,
        endPostIndex : endPostIndex
      });
    });
  });
});

router.get('/search', function(req, res, next) {
  var query = req.query.query !== undefined ? req.query.query : '';
  var searchTerms = query.split(/[ ,]+/).filter(Boolean);
  var page = req.query.page !== undefined && req.query.page >= 0 ? req.query.page - 1 : 0;
  var numPerPage = req.query.show !== undefined && parseInt(req.query.show) >= 0 ? parseInt(req.query.show) : 10;

  DB.getCategories(function(err, categories) {
    if (err) {
      Utils.renderError(res, req, err);
      return;
    }

    DB.getPosts('All', searchTerms, function(err, posts) {
      if (err) {
        Utils.renderError(res, req, err);
        return;
      }

      var postList = posts.slice(page * numPerPage, page * numPerPage + numPerPage);

      res.render('blog', {
        user : req.user,
        page : page + 1,
        totalPages : Math.ceil(posts.length / numPerPage),
        numPerPage : numPerPage,
        categories : categories,
        posts : postList,
        totalNumPosts : posts.length,
        startPostIndex : page * numPerPage + 1,
        endPostIndex : page * numPerPage + postList.length,
        searchTerms : searchTerms.join(" + "),
        query : query
      });
    });
  });
});

module.exports = router;
