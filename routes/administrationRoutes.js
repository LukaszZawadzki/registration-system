var express = require("express");
var router = express.Router();
var passport = require("passport");
var Terminy = require("../models/terminy");
var Students = require("../models/students");
var User = require("../models/user");
var LocalStrategy = require("passport-local");

//--------------------------------------------
//Auth routes
//--------------------------------------------


//registration form
router.get("/register", isLoggedIn, function(req, res){
    res.render("administration/register");
});

//handling user register
router.post("/register", isLoggedIn, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){ 
            console.log(err);
            var color = "red";
            var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
            return res.render("registration/success", {color, message});
        }
        passport.authenticate("local")(req, res, function(){
        return res.redirect("logowanie");
        });
    });
});
//sign up form
router.get("/logowanie", function(req, res){
    res.render("administration/login");
});

//handling user sign up
router.post("/logowanie", passport.authenticate("local", {
       successRedirect: "/administracja/",
       failureRedirect: "/administracja/logowanie"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


//--------------------------------------------
//show all
//--------------------------------------------

router.get("/", isLoggedIn, function (req, res) {
    Terminy.find({},{},{sort:{
        name: 1
    }})
    .then(function(wszystkieTerminy){
        res.render("administration/show", {wszystkieTerminy});
    })
    .catch(function(err){
            console.log(err);
            var color = "red";
            var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
            res.render("registration/success", {color, message});
    })
});

//--------------------------------------------
//show one
//--------------------------------------------

router.get("/:groupId", isLoggedIn, function(req, res) {
    var groupId = req.params.groupId;
    Students.find({group:groupId},{},{sort:{
        lastname: 1
    }})
    .then(function(allStudents) {
        if(allStudents.length == 0) {
            Terminy.findById(groupId)
            .then(function(termin){
                if (termin._id == groupId) {
                    res.render("administration/showOne", {allStudents});
                } else {
                    var color = "red";
                    var message = "Błędna grupa, proszę o kontakt z administratorem";
                    res.render("registration/success", {color, message});
                }
            })
            .catch(function(err){
                console.log(err)
                var color = "red";
                var message = "Błędna grupa, proszę o kontakt z administratorem";
                res.render("registration/success", {color, message});
            })
        } else {
            res.render("administration/showOne", {allStudents});
        }
    })
    .catch(function(err){
            console.log(err);
            var color = "red";
            var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
            res.render("registration/success", {color, message});
    })
});

//--------------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/administracja/logowanie");
}



module.exports = router;