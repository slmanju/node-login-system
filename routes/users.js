var express = require('express');
var router = express.Router();

var User = require("../models/user");
var UserValidator = require("../validator/user");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// register get
router.get("/register", function (req, res) {
    res.render("register");
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

module.exports = router;
