// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var LocalStrategyRest = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/userModel');
var Rest = require('../app/models/restModel');
// var Admin           = require('../app/models/adminModel');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // passport session setup ==================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (user)
                done(err, user);
            else{
                Rest.findById(id, function (err, user) {
                    done(err, user);
                });
            }
        });
        
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    //user signup
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.firstname = req.body.firstname;
                    newUser.local.lastname = req.body.lastname;
                    newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser, req.flash('signupMessage', 'Successfully created account.'));
                    });
                }

            });

        }));

    // User LOGIN =============================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form

            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // console.log(user);
                // all is well, return successful user
                return done(null, user, req.flash('loginMessage', 'Log in successfully as user.'));

            });
        }));

    
    //////////////////////////////////////////////////////////////////////////////////////////////////////
     // REST SIGNUP ============================================================
     passport.use('rest-signup', new LocalStrategyRest({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            Rest.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new Rest();

                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.name = req.body.name;
                    newUser.local.phone = req.body.phone;
                    newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser, req.flash('signupMessage', 'Successfully created account.'));
                    });
                }

            });

        }));

    // REST LOGIN =============================================================
    passport.use('rest-login', new LocalStrategyRest({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form

            Rest.findOne({ 'local.email': email }, function (err, rest) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!rest)
                    return done(null, false, req.flash('loginMessage', 'No rest found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!rest.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // console.log(user);
                // all is well, return successful user
                return done(null, rest, req.flash('loginMessage', 'Log in successfully as rest.'));
                
            });
        }));






};