var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchama = new mongoose.Schema({
    username: String,
    password: String,
    administrator: {
        type: Boolean,
        default: false
    },
    email: String
});

UserSchama.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchama);