var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require("../models/user");
var UserValidator = require("../validator/user");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// register get
router.get("/register", function (req, res) {
    res.render('register', {
        'title': 'Register'
    });
});

// register post
router.post("/register", function (req, res) {
    var errors = UserValidator.validate(req);
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            password2: req.body.password2
        });

        User.saveUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
            req.flash("success_msg", "You are registered");
            res.redirect("/users");
        });
    }
});

// configure passport
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findUserByUsername(username, function(err, user){
            console.log("user", user);
            if(err) throw err;
            if(!user){
                console.log('Unknown User');
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

// login get form
router.get("/login", function (req, res) {
    res.render("login", {
        title: "Login"
    });
});

// login submit
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
}), function (req, res) {
    console.log('Authentication Successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

// logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

module.exports = router;
