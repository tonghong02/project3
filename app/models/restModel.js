// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var restSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
        name: String,
        address: String,
        phone: Number,
        url: {type: String, default: 'http://lorempixel.com/200/200/people/9/'}

    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

// methods ======================
// generating a hash
restSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
restSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for Rests and expose it to our app
module.exports = mongoose.model('Rests', restSchema);
