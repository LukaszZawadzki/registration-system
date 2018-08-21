var express = require("express");
var router = express.Router();
var passport = require("passport");
var Terminy = require("../models/terminy");
var Students = require("../models/students");
var User = require("../models/user");
var LocalStrategy = require("passport-local");
var fs = require("fs");


router.get("/", isLoggedIn, function(req, res) {
    Students.find({},{},{sort:{
        addedTime: 1
    }})
    .then(function(allStudents){
        saveData(`./backup/students/${Date.now().toString()}.json`, JSON.stringify(allStudents)/*.toString()*/, "utf8");
        var color = "green";
        var message = "kopia zapisana";
        res.render("registration/success", {color, message});
    })
    .catch(function(err){
            console.log(err);
            var color = "red";
            var message = "nie udało się pobrać danych z bazy danych";
            res.render("registration/success", {color, message});
    })
});



// functions
function saveData(filename, data, encoding) {
    fs.writeFile(filename, data, encoding, function(error){
            if(error){
                console.log(error);
            };
            console.log("file writen");
        })
};
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/administracja/logowanie");
};



module.exports = router;
