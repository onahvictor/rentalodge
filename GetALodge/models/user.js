const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    // username: {
    //     required: true,
    //     type: String
    // }
});

userSchema.plugin(passportLocalMongoose);
//this is going to add on to our username a field for password and username
//its going to make sure that our usernames are unique its also goint to add up some methods for us.

module.exports = mongoose.model('User', userSchema);