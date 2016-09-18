/* Future Blue Website
------------------------------------------------------ */
var express = require('express');
var cfenv = require('cfenv');
var ejs = require('ejs');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var fs = require('fs');

var configFilename = "./config/secret-config.js";
var config;

try {
    config = require(configFilename);
} catch (err) {
    config = {};
    console.log("ERROR: unable to read file '" + configFilename + "' : ", err);
}

require('./config/passport')(passport);

// Create a new express server
var app = express();
var appEnv = cfenv.getAppEnv();

// Set the template engine to use EJS
app.set('view engine', 'ejs');

// Serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session(config.cookies));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Set up the routes
------------------------------------------------------ */
var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var about = require('./routes/about');
var blog = require('./routes/blog');
var dashboard = require('./routes/dashboard');
var resources = require('./routes/resources');
var toronto = require('./routes/toronto');
var contact = require('./routes/contact');
var gallery = require('./routes/gallery');
var user = require('./routes/user');
var post = require('./routes/post');
var template = require('./routes/template');

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/about', about);
app.use('/blog', blog);
app.use('/dashboard', dashboard);
app.use('/resources', resources);
app.use('/contact', contact);
app.use('/gallery', gallery);
app.use('/template', template);
app.use('/user', user);
app.use('/web', require('../darkblue').app); //Launch web team site on /web route!
blog.use('/post', post);
resources.use('/toronto/', toronto);

/* Handle robots.txt so web crawlers can index the site
------------------------------------------------------ */
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\n\
Allow: /\n\
Disallow: /dashboard\n\
Disallow: /blog/edit\n\
Disallow: /blog/create-post\n\
Disallow: /logout");
});

/* 404 Page
-------------------------------------------------------- */
app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('error', {
            user: req.user,
            title: "404: Page Not Found",
            message: "It looks like we cannot find the page you are looking for :(",
            icon: "frown"
        });

        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });

        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

/* Start the server
------------------------------------------------------ */
/*app.listen(appEnv.port, '0.0.0.0', function () {
    console.log("server starting on " + appEnv.url);
});*/
app.listen(80, '0.0.0.0', function () {
    console.log("Server started! Have a nice day!");
});