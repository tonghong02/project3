var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/'});

// app/routes.js
module.exports = function (app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function (req, res) {
		
		res.render('user/index.ejs', { user: req.user, message: req.flash('loginMessage') });
	});

	app.get('/popular', function (req, res) {
		res.render('popular', { user: req.user });
	});

	app.get('/order', function (req, res) {
		res.render('order', { user: req.user });
	});

	app.get('/contact', function (req, res) {
		res.render('contact', { user: req.user });
	});
	app.get('/map', function (req, res) {
		res.render('map', { user: req.user });
	});



	// LOGIN ===============================
	// show the login form 
	// user


	app.get('/login', function (req, res) {

		// render the page and pass in any flash data if it exists
		res.render('user/login', { message: req.flash('loginMessage'), signupMessage: req.flash('signupMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));



	// SIGNUP ==============================
	// show the signup form
	//user


	app.get('/signup', function (req, res) {

		// render the page and pass in any flash data if it exists
		res.render('user/signup', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/login', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));




	// PROFILE SECTION =========================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function (req, res) {

		res.render('user/profile', {
			user: req.user // get the user out of session and pass to template,
			// "message": "upload avt success!!!"
		});
	});

	// ***  Upload img  ***

	// app.get("/profile/upload", function(req, res){
	// 	res.json({"message": "upload success!!"});
	// })


	// app.post('/profile', upload.any(), function(req, res){
	// 	// console.log("qrerewrw");
	//   	res.send(req.files);
	// });


	// LOGOUT ==============================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/checklogin', function (req, res) {
		if (req.user)
			res.send(true);
		else
			res.send(false);
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
