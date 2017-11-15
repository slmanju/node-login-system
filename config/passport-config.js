/**
 * Created by manjula on 11/15/17.
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");

passport.use(new LocalStrategy(function (username, password, done) {
    User.findByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: "Unknown user" });
        }
        User.comparePassword(password, user.password, function (err, isMath) {
            if (err) throw err;
            if (isMath) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid password" })
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});