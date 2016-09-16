var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var knex = require('./knex.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        knex.select().table('users').where('id', id).then(function(rows) {
            return done(null, rows[0]);
        }).catch(function(err) {
            return done(err);
        });
    });

    // Override the local strategy to use email instead of username
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        knex.select().table('users').where('email', email).then(function(rows) {
            if (rows.length) {
                return done(null, false, req.flash('message', 'That email is already taken.'));
            } else {
                var newUser = {
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    email : email,
                    internshipStart : new Date(req.body.internshipStart).toISOString(),
                    internshipEnd : new Date(req.body.internshipEnd).toISOString(),
                    password : bcrypt.hashSync(password),
                    accountType : 'Member',
                    dateJoined : new Date().toISOString()
                }

                knex.insert(newUser).into('users').returning('id').then(function(id) {
                    newUser.id = id[0];

                    return done(null, newUser);
                });
            }
        }).catch(function(err) {
            return done(err);
        });
    }));

    // Override the local strategy to use email instead of username
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        knex.select().table('users').where('email', email).then(function(rows) {
            if (!rows.length) {
                return done(null, false, req.flash('message', 'No user with that email exists'));
            }

            if (!bcrypt.compareSync(password, rows[0].password)) {
                return done(null, false, req.flash('message', 'Oops! You entered the wrong password'));
            }

            return done(null, rows[0]);
        }).catch(function(err) {
            return done(err);
        });
    }));
};
