/**
 * Created by manjula on 11/14/17.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

// save new user. bcrypt module is used to generate hash
UserSchema.statics.saveUser = function (newUser, callback) {
    var rounds = 10;
    bcrypt.genSalt(rounds, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

// find user by username
UserSchema.statics.findUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
};

// find user by id
UserSchema.statics.findUserById = function (id, callback) {
    User.findById(id, callback);
};

// compare password
UserSchema.statics.comparePassword = function (targetPassword, hash, callback) {
    bcrypt.compare(targetPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

var User = mongoose.model("User", UserSchema);
module.exports = User;