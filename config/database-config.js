var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp')
    .then(function () {
        console.log('connection successful')
    })
    .catch(function (err) {
        console.error(err)
    });