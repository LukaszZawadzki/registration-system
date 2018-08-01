var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    telephone: String,
    school: String,
    schoolClass: String,
    group: String,
    address: String,
    zgoda: String,
    active: {
        type: Boolean,
        default: true
    },
    verificated: {
        type: Boolean,
        default: true
    },
    verificationTo: {
        type: Date,
        default: null
    },
    addedTime: {
        type: Date,
        default: Date.now()
    },
    terminy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Terminy"
    }
});

module.exports = mongoose.model("Students", studentSchema);