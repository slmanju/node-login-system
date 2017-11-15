"use strict";

var User = require("../models/user");
var UserValidator = require("../validator/user");

var UserController = {};

// register get
UserController.getRegister = function(req, res) {
    res.render('register', {
        title: 'Register'
    });
};

// register post
UserController.postRegister = function (req, res) {
    var errors = UserValidator.validate(req);
    if (errors) {
        res.render('register', {
            title: 'Register',
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
            req.flash("success_msg", "You are registered");
            res.location('/');
            res.redirect('/');
        });
    }
};

// login get form
UserController.getLogin = function (req, res) {
    res.render("login", {
        title: "Login"
    });
};

// login submit
// ???

// logout
UserController.logout = function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
};

module.exports = UserController;
