var mongoose = require("mongoose");

var terminySchema = new mongoose.Schema({
    name: String,
    active: Boolean,
    students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Students"
            }
        ],
    year: Number,
    grade: Number,
    day: String,
    hour: String
});

module.exports = mongoose.model("Terminy", terminySchema);