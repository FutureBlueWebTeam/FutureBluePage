var express = require('express');
var knex = require('./knex.js');
var Utils = require('../config/Utils.js');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/**
 * This file contains helper functions for interacting with the database. Any database calls should
 * be run from a function in this file!
 */

var DB = {

	getCategories : function(next) {
		var query = 'SELECT * \
	                FROM (SELECT 0 AS id, \
	                             "All" AS category, \
	                             "ibm-btn-red-50" AS colour, \
	                             COUNT(*) AS numPosts \
	                      FROM posts \
	                      UNION \
	                      SELECT categories.id AS id, \
	                             categories.category AS category, \
	                             categories.colour AS colour, \
	                             COUNT(posts.category) AS numPosts \
	                      FROM categories LEFT JOIN posts ON categories.category = posts.category \
	                      GROUP BY categories.category) AS rows \
	                ORDER BY rows.id ASC;';

	    knex.raw(query).then(function(result) {
	    	var categories = result[0].reduce(function(map, o) {
	            map[o.category] = { 
	                colour : o.colour,
	                numPosts : o.numPosts
	            };

	            return map;
	        }, { });

	        return next(null, categories);
	    }).catch(function(err) {
	    	return next(err);
	    });
	},

	getPost : function(id, next) {
		this.getCategories(function(err, categories) {
			if (err) {
				return next(err);
			}

			knex.select('posts.id',
						'posts.title', 
						'posts.htmlBody', 
						knex.raw('DATE_FORMAT(posts.datePosted, "%M %e, %Y") AS datePosted'), 
						'posts.category',
						'posts.tags',
						'categories.colour',
						'posts.featuredImagePath', 
						knex.raw('users.id AS authorId'), 
						'users.firstName', 
						'users.lastName',
						'users.profilePicturePath',
						'users.signature',
						'users.email').from('posts')
				.innerJoin('users', 'posts.user', 'users.id')
				.innerJoin('categories', 'posts.category', 'categories.category').where('posts.id', id).then(function(result) {
					if (result.length === 1) {
						result[0].tags = JSON.parse(result[0].tags);
			    		return next(null, result[0], categories);
					} else {
						return next("The post with the id, '" + id + "' does not exist!");
					}
			}).catch(function(err) {
				return next(err);
			});
		});
	},

	getPosts : function(category, search, next) {
		var query = knex.select(knex.raw("posts.id, \
										  posts.title, \
	                                      posts.category, \
	                                      posts.tags, \
	                                      posts.featuredImagePath, \
	                                      users.profilePicturePath, \
	                                      CONCAT(users.firstName, ' ', users.lastName) AS author, \
	                                      users.id AS authorId, \
	                                      (CASE WHEN LENGTH(posts.htmlBody) - LENGTH(REPLACE(posts.htmlBody, ' ', '')) > 50 \
	                                          THEN CONCAT(SUBSTRING_INDEX(posts.htmlBody, ' ', 51), ' ...') \
	                                          ELSE SUBSTRING_INDEX(posts.htmlBody, ' ', 51) \
	                                          END) AS description, \
										  posts.htmlBody, \
	                                      DATE_FORMAT(posts.datePosted, '%M %e, %Y') AS datePosted"))
	                    .table('posts')
	                    .innerJoin('users', 'posts.user', 'users.id');

	    if (category !== 'All') {
	        query.where('posts.category', category);
	    }

	    for (var i = 0; search && i < search.length; i++) {
	    	var where = knex.raw("LOWER(CONCAT(posts.title, ' ', posts.category, ' ', users.firstName, ' ', users.lastName, ' ', posts.htmlBody, ' ', posts.tags)) LIKE LOWER(?)", ["%" + search[i] + "%"]);
	    	
	    	if (i === 0) {
	    		query.where(where);
	    	} else {
	    		query.orWhere(where);
	    	}
	    }

	    query.orderBy('posts.datePosted', 'desc').then(function(result) {
	    	for (var i = 0; i < result.length; i++) {
	    		result[i].tags = JSON.parse(result[i].tags);
	    	}

	        return next(null, result);
	    }).catch(function(err) {
	      	return next(err);
	    });
	},

	deletePost : function(postId, next) {
		knex.del().table('posts').where('id', postId).then(function(result) {
			next(null, result[0]);
		}).catch(function(err) {
			next(err);
		});
	},

	getRecentPosts : function(n, next) {
		knex.select(knex.raw("posts.id, \
							  posts.title, \
							  posts.category, \
							  categories.colour, \
							  users.profilePicturePath, \
							  DATE_FORMAT(posts.datePosted, '%M %e, %Y') AS datePosted, \
							  posts.featuredImagePath, \
							  CONCAT(users.firstName, ' ', users.lastName) AS author, \
							  users.id AS authorId"))
			.table('posts')
			.innerJoin('users', 'posts.user', 'users.id')
			.innerJoin('categories', 'posts.category', 'categories.category')
			.orderBy('posts.datePosted', 'DESC')
			.limit(n).then(function(result) {
			return next(null, result);
		}).catch(function(err) {
			return next(err);
		});
	},

	getUser : function(id, next) {
		knex.select('firstName', 'lastName', 'email', 'signature', 'profilePicturePath', 'website', 'linkedin', 'id')
			.from('users')
			.where({ id : id })
			.then(function(result) {
				if (result[0]) {
					next(null, result[0]);
				} else {
					next("This user does not exist!");
				}
		}).catch(function(err) {
			next(err);
		});
	},

	getUsers : function(next) {
		var query = "SELECT id, \
						firstName, \
						lastName, \
						email, \
						DATE_FORMAT(internshipStart, '%Y-%m-%d') AS internshipStart, \
						DATE_FORMAT(internshipEnd, '%Y-%m-%d') AS internshipEnd, \
						accountType, \
						signature, \
						profilePicturePath, \
						website, \
						linkedin, \
						DATE_FORMAT(dateJoined, '%d/%m/%Y') AS dateJoined \
					FROM users \
					ORDER BY firstName ASC, lastName ASC, dateJoined DESC;"

		knex.raw(query).then(function(result) {
			next(null, result[0]);
		}).catch(function(err) {
			next(err);
		});
	},

	deleteUser : function(userId, next) {
		knex.del().table('users').where('id', userId).then(function(result) {
			next(null, result[0]);
		}).catch(function(err) {
			next(err);
		});
	},

	saveUser : function(user, next) {
		knex.update(user).table('users').where('id', user.id).then(function(result) {
			next(null, result);
		}).catch(function(err) {
			next(err);
		});
	},

	getPostsByUser : function(userId, next) {
		knex.select('id', 
					'title',
					'category',
					knex.raw('DATE_FORMAT(posts.datePosted, "%M %e, %Y") AS datePosted'))
			.where('user', userId)
			.orderBy('datePosted', 'ASC')
			.from('posts').then(function(result) {

			next(null, result);
		}).catch(function(err) {
			next(err);
		});
	},

	getPhotos : function(next) {
		var query = "SELECT photos.id, \
						photos.path, \
						photos.title, \
						photos.description, \
						DATE_FORMAT(photos.datePosted, '%M %e, %Y') AS datePosted, \
						users.firstName, \
						users.lastName \
					FROM photos INNER JOIN users ON photos.user = users.id \
					ORDER BY photos.datePosted DESC";

		knex.raw(query).then(function(result) {
			var photos = result[0];
			next(null, photos);
		}).catch(function(err) {
			next(err);
		});
	},

	getPhoto : function(id, next) {
		var query = "SELECT photos.id, \
						photos.path, \
						photos.title, \
						photos.description, \
						DATE_FORMAT(photos.datePosted, '%M %e, %Y') AS datePosted, \
						users.firstName, \
						users.lastName \
					FROM photos INNER JOIN users ON photos.user = users.id \
					WHERE photos.id = " + id + ";";

		knex.raw(query).then(function(result) {
			var photo = result[0][0];
			next(null, photo);
		}).catch(function(err) {
			next(err);
		});
	},

	insertPhotos : function(photos, userId, next) {
		var query = "INSERT INTO photos \
						(path, user) \
					VALUES ";

		photos.forEach(function(photo, i) {
			query += "(\"" + photo + "\", " + userId + ")"

			if (i < photos.length - 1) {
				query += ", ";
			} else {
				query += ";";
			}
		});

		knex.raw(query).then(function(result) {
			next(null, result[0]);
		}).catch(function(err) {
			next(err);
		});
	},

	updatePhoto : function(photo, next) {
		knex.update(photo).table('photos').where('id', photo.id).then(function(result) {
			next(null, result[0]);
		}).catch(function(err) {
			next(err);
		});
	},

	deletePhoto : function(photoId, next) {
		/*this.getPhoto(photoId, function(err, photo) {
			if (err) {
				next(err);
				return;
			}

			// Relative path does not work for some reason
			fs.unlink("../public" + photo.path, function(err, result) {
				if (err) {
					next(err);
					return;
				}*/

				knex.del().table('photos').where('id', photoId).then(function(result) {
					next(null, result[0]);
				}).catch(function(err) {
					next(err);
				});
			/*});
		});*/
	}

}

module.exports = DB;