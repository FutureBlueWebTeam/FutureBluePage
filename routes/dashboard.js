var express = require('express');
var Auth = require('../config/Auth.js');
var knex = require('../config/knex.js');
var Utils = require('../config/Utils.js');
var DB = require('../config/DB.js');
var bcrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick : true });
var router = express.Router();

/* GET dashboard page. */
router.get('/', Auth.isLoggedIn, function(req, res, next) {
	res.redirect('/dashboard/profile');
});

/* Profile page
-------------------------------------------------------------------------------- */
router.get('/profile', Auth.isLoggedIn, function(req, res, next) {
	res.render('dashboard/profile', {
		dashboard : "ibm-highlight",
		user : req.user,
		section : 'profile'
	});
});

router.post('/profile/upload_profile_picture', Auth.isLoggedIn, function(req, res, next) {
	var form = new formidable.IncomingForm();
    form.uploadDir = "./public/image_uploads/profile";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        if (err) {
          res.render('error', {
            user : req.user,
            title : 'Something went wrong...',
            message : Utils.getErrorMessage(err),
            icon : 'remove'
          });

          return;
        }

        var imagePath = files.file.path.replace(/\\/g, "/");

        gm(imagePath).resize(600, null, "^>").gravity('center').write(imagePath, function(err) {
			if (err) { 
				res.render('error', {
		            user : req.user,
		            title : 'Something went wrong...',
		            message : Utils.getErrorMessage(err),
		            icon : 'remove'
				});

				return;
			}

			imagePath = imagePath.replace(/public/, "");
			res.send({ src : imagePath });
		});
    });
});

router.post('/profile/edit_profile', Auth.isLoggedIn, function(req, res, next) {
	knex.select().table('users').where('email', req.body.email).then(function(rows) {
		if (rows.length && rows[0].id != req.body.id) {
			console.log("email taken");
			res.send({ message : "email taken" });
		} else {
			var user = {
				id : req.body.id,
				firstName : req.body.firstName,
				lastName : req.body.lastName,
				profilePicturePath : req.body.profilePicturePath,
				email : req.body.email,
				website : req.body.website,
				linkedin : req.body.linkedin,
				signature : req.body.signature
			};

			if (req.body.password) {
				user.password = bcrypt.hashSync(req.body.password);
			}

			DB.saveUser(user, function(err, result) {
				if (err) {
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					res.send({ message : "success" });
				}
			});
		}
	});
});

/* Blog
-------------------------------------------------------------------------------- */
router.get('/blog', Auth.isBlogger, function(req, res, next) {
	DB.getPosts('All', null, function(err, posts) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});

			return;
		}

		res.render('dashboard/manage-blog', {
			dashboard : "ibm-highlight",
			user : req.user,
			data : posts,
			section : 'blog'
		});
	});
});

/* Create post page
-------------------------------------------------------------------------------- */
router.get('/blog/create-post', Auth.isBlogger, function(req, res, next) {
  DB.getCategories(function(err, categories) {
    if (err) {
      res.render('error', {
        user : req.user,
        title : 'Something went wrong...',
        message : Utils.getErrorMessage(err),
        icon : 'remove'
      });

      return;
    }

    var categoryArray = [];

    for (var key in categories){
      if (key !== 'All')
      categoryArray.push(key);
    }

    res.render('create-post', {
      user : req.user,
      categoryArray : categoryArray,
      title : "Create New Post"
    });
  });
});

router.post('/blog/create-post/upload_image', Auth.isBlogger, function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/image_uploads/";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
		} else {
			var imagePath = files.upload.path.replace(/\\/g, "/");

			gm(imagePath).resize(600, null, "^>").gravity('center').write(imagePath, function(err) {
				if (err) { 
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					imagePath = imagePath.replace(/public/, "");

					var html = "";
					html += "<script type='text/javascript'>";
					html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
					html += "    var url     = \"" + imagePath + "\";";
					html += "    var message = \"Uploaded file successfully\";";
					html += "";
					html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
					html += "</script>";

					res.send(html);
				}
			});
		}
    });
});

router.post('/blog/create-post/upload_featured_image', Auth.isBlogger, function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/image_uploads/featured";
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
		} else {
			var imagePath = files.uploadFile.path.replace(/\\/g, "/");

			gm(imagePath).resize(600, null, "^>").gravity('center').write(imagePath, function(err) {
				if (err) { 
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					imagePath = imagePath.replace(/public/, "");
					res.send({ src : imagePath });
				}
			});
		}
    });
});

router.post('/blog/create-post/publish', Auth.isBlogger, function(req, res, next) {
  // write to db
  knex('posts').insert({
    title : req.body.titleVal,
    htmlBody : req.body.bodyVal,
    category : req.body.catVal,
    user : req.user.id,
    tags : req.body.tags instanceof Array ? JSON.stringify(req.body.tags) : "[]",
    featuredImagePath : req.body.imgVal
  }).then(function(result) {
    res.send({
      url : '/blog/post/' + result[0]
    });
  }).catch(function(err) {
    res.render('error', {
      user : req.user,
      title : 'Something went wrong...',
      message : Utils.getErrorMessage(err),
      icon : 'remove'
    });
  });
});

/* Edit page
-------------------------------------------------------------------------------- */
router.get('/blog/edit/:id', Auth.isBlogger, function(req, res, next) {
	DB.getPost(req.params.id, function(err, post, categories) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});

			return;
		}

		var categoryArray = [];

		for (var key in categories) {
			if (key !== 'All') {
				categoryArray.push(key);
			}
		}

		// Replace line breaks and quotes
		post.htmlBody = post.htmlBody.replace(/(\r\n|\n|\r)/gm,"").replace(/"/g, "'");

		res.render('create-post', {
			user : req.user,
			post : post,
			categoryArray : categoryArray,
			title : "Edit Blog Post"
		});
	});
});

router.post('/blog/edit/upload_image', Auth.isBlogger, function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/image_uploads/";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
        } else {
            var imagePath = files.upload.path.replace(/\\/g, "/");

            gm(imagePath).resize(600, null, "^>").gravity('center').write(imagePath, function(err) {
				if (err) { 
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					imagePath = imagePath.replace(/public/, "");

					var html = "";
		            html += "<script type='text/javascript'>";
		            html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
		            html += "    var url     = \"" + imagePath + "\";";
		            html += "    var message = \"Uploaded file successfully\";";
		            html += "";
		            html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
		            html += "</script>";

		            res.send(html);
				}
			});
            
        }
    });
});

router.post('/blog/edit/upload_featured_image', Auth.isBlogger, function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/image_uploads/featured";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
        } else {
            var imagePath = files.upload.path.replace(/\\/g, "/");

            gm(imagePath).resize(600, null, "^>").gravity('center').write(imagePath, function(err) {
				if (err) { 
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					imagePath = imagePath.replace(/public/, "");
            		res.send({ src : imagePath });
            	}
            });
        }
    });
});

router.post('/blog/edit/update/:id', Auth.isBlogger, function(req, res, next) {
	knex('posts').where('id', req.params.id).update({
		title 			  : req.body.titleVal,
		htmlBody 		  : req.body.bodyVal,
		category 		  : req.body.catVal,
		tags			  : req.body.tags instanceof Array ? JSON.stringify(req.body.tags) : "[]",
		featuredImagePath : req.body.imgVal
	}).then(function(result) {
		res.send({
			url : '/blog/post/' + req.params.id
		});
	}).catch(function(err) {
		res.render('error', {
			user : req.user,
			title : 'Something went wrong...',
			message : Utils.getErrorMessage(err),
			icon : 'remove'
		});
	});
});

router.post('/blog/edit/delete_post', Auth.isBlogger, function(req, res, next) {
	DB.deletePost(req.body.id, function(err, result) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
			
			return;
		}else{
            res.redirect('/blog');
        } 
	});
});

/* Manage Users page
-------------------------------------------------------------------------------- */
router.get('/users', Auth.isAdmin, function(req, res, next) {
	DB.getUsers(function(err, users) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});

			return;
		}

		res.render('dashboard/users', {
			dashboard : "ibm-highlight",
			user : req.user,
			data : users,
			section : 'users'
		});
	});
});

router.post('/edit_user', Auth.isAdmin, function(req, res, next) {
	knex.select().table('users').where('email', req.body.email).then(function(rows) {
		if (rows.length && rows[0].id != req.body.id) {
			console.log("email taken");
			res.send({ message : "email taken" });
		} else {
			var user = {
				id : req.body.id,
				firstName : req.body.firstName,
				lastName : req.body.lastName,
				email : req.body.email,
				website : req.body.website,
				linkedin : req.body.linkedin,
				internshipStart : new Date(req.body.internshipStart).toISOString(),
				internshipEnd : new Date(req.body.internshipEnd).toISOString(),
				profilePicturePath: req.body.profilePicturePath,
				accountType : req.body.accountType,
				signature : req.body.signature
			};

			if (req.body.password) {
				user.password = bcrypt.hashSync(req.body.password);
			}

			DB.saveUser(user, function(err, result) {
				if (err) {
					res.render('error', {
						user : req.user,
						title : 'Something went wrong...',
						message : Utils.getErrorMessage(err),
						icon : 'remove'
					});
				} else {
					res.send({ message : "success" });
				}
			});
		}
	});
});

router.post('/delete_user', Auth.isAdmin, function(req, res, next) {
	DB.deleteUser(req.body.id, function(err, result) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});

			return;
		}

		res.send({ message : result });
	});
});

/* Manage Photo Gallery page
-------------------------------------------------------------------------------- */
router.get('/gallery', Auth.isAdmin, function(req, res, next) {
	DB.getPhotos(function(err, photos) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});

			return;
		}

		res.render('dashboard/gallery', {
			dashboard : "ibm-highlight",
			user : req.user,
			data : photos
		});
	});
});

router.get('/gallery/add-photos', Auth.isAdmin, function(req, res, next) {
	res.render('dashboard/add-photos', {
		dashboard : "ibm-highlight",
		user : req.user
	});
});

router.post('/gallery/upload_photos', Auth.isAdmin, function(req, res, next) {
	var form = new formidable.IncomingForm();
    form.uploadDir = "./public/image_uploads/gallery";
    form.keepExtensions = true;

    var photos = [];

    form.on('file', function(field, file) {
        if (/(jpg|gif|png|jpeg|JPG|GIF|PNG|JPEG)$/.test(file.path)) {
        	photos.push(file.path.replace(/^(public)/, "").replace(/\\/g, "/"));
    	}
    });

    form.on('end', function() {
    	for (var i = 0; i < photos.length; i++) {
    		var photo = photos[i];
	    	var thumbnail = Utils.getThumbnailPath(photo);

			photo = process.cwd() + "/public" + photo;
			photo = photo.replace(/\\/g, "/");
			thumbnail = process.cwd() + "/public" + thumbnail
			thumbnail = thumbnail.replace(/\\/g, "/");

			gm(photo).resize(null, 320)
					 .gravity('center')
					 .write(thumbnail, function(err) {

				if (err) { 
					res.render('error', {
			            user : req.user,
			            title : 'Something went wrong...',
			            message : Utils.getErrorMessage(err),
			            icon : 'remove'
			        });
				}
			});
		}
	});

    // Note, this will upload the photos, plus some empty file that is unneeded.
    form.parse(req, function(err, fields, files) {
        if (err) {
          res.render('error', {
            user : req.user,
            title : 'Something went wrong...',
            message : Utils.getErrorMessage(err),
            icon : 'remove'
          });
        }

        DB.insertPhotos(photos, req.user.id, function(err, result) {
        	if (err) {
				res.render('error', {
					user : req.user,
					title : 'Something went wrong...',
					message : Utils.getErrorMessage(err),
					icon : 'remove'
				});
	        }

	        res.redirect('/dashboard/gallery');
        });
    });
});

router.post('/gallery/edit_photo', Auth.isAdmin, function(req, res, next) {
	var photo = {
		id : req.body.id,
		title : req.body.title,
		description : req.body.description
	};

	DB.updatePhoto(photo, function(err, result) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
			
			return;
		}

		res.send({ message : result });
	});
});

router.post('/gallery/delete_photo', Auth.isAdmin, function(req, res, next) {
	DB.deletePhoto(req.body.id, function(err, result) {
		if (err) {
			res.render('error', {
				user : req.user,
				title : 'Something went wrong...',
				message : Utils.getErrorMessage(err),
				icon : 'remove'
			});
			
			return;
		}

		res.send({ message : result });
	});
});

router.get('/calendar', Auth.isAdmin, function(req, res, next) {
	// Calendar stuff goes here
	res.render('dashboard/calendar', {
		dashboard : "ibm-highlight",
		user : req.user,
		data : [],
		section : 'calendar'
	});
});

module.exports = router;
