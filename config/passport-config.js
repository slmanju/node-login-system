var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");

// configure passport
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findUserById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findUserByUsername(username, function (err, user) {
            console.log("user", user);
            if (err) throw err;
            if (!user) {
                console.log('Unknown User');
                return done(null, false, {
                    message: 'Unknown User'
                });
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                }
            });
        });
    }
));
