// server.js

// set up ======================================================================
// get all the tools we need

var express  = require('express');
var session = require('express-session');
var morgan = require("morgan");
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var userController = require('./app/controllers/userController');
var restController = require('./app/controllers/restController');





// const osTmpdir = require('os-tmpdir');
 
// osTmpdir();

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


require('./config/passport')(passport); // pass passport for configuration
// require('./config/restpassport')(passport); 

app.configure(function() {

	// set up our express application
	app.use("/assets", express.static(__dirname + "/public"));
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	
});


// routes ======================================================================
require('./app/routes/user.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/rest.js')(app, passport);
userController(app);
restController(app);


app.get("/profile", function(req, res){
		res.json({"message": "upload success!!"});
	})


var multer  = require('multer');
var upload = multer({ dest: 'assets/uploads/'});

app.post('/profile', upload.any(), function(req, res){
		console.log("test post");
	  	res.send(req.files);
	});



// var routes = require(__dirname + "/app/routes");
// app.use(routes);
// launch ======================================================================
app.listen(port);
console.log('The server listen on port ' + port);
