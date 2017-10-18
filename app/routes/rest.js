var multer  =   require('multer');

module.exports = function (app, passport) {

    var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, './upload');
        },
        filename: function (req, file, callback) {
          callback(null, file.fieldname + '-' + Date.now());
        }
      });
      var upload = multer({ storage : storage}).single('filetoupload');
      
      
      
      app.post('/uploadavatar',function(req,res){
          upload(req,res,function(err) {
              if(err) {
                  return res.end("Error uploading file.");
              }
              res.end("File is uploaded");
          });
      });
      
    // Everything went fine

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================


    //rest
    app.get('/rest', function (req, res) {
        res.render('rest/index.ejs', { user: req.user, message: req.flash('loginMessage') });
    });





    // LOGIN ===============================
    // show the login form 
    //rest
    app.get('/restlogin', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('rest/login', { message: req.flash('loginMessage'), signupMessage: req.flash('signupMessage') });
    });

    // process the login form
    app.post('/restlogin', passport.authenticate('rest-login', {
        successRedirect: '/rest', // redirect to the secure profile section
        failureRedirect: '/restlogin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // SIGNUP ==============================
    // show the signup form
    //rest
    app.get('/restsignup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('rest/signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/restsignup', passport.authenticate('rest-signup', {
        successRedirect: '/restlogin', // redirect to the secure profile section
        failureRedirect: '/restsignup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));




    // PROFILE SECTION =========================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)


    app.get('/restprofile', isLoggedIn, function (req, res) {
        res.render('rest/profile', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/rest');
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


