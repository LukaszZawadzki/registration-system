var express = require("express");
var router = express.Router();
var Terminy = require("../models/terminy");
var Students = require("../models/students");
//routes


//pierwszy rok
router.get("/pierwszy-rok", function (req, res){
    var klasy = "VII szkoły podstawowej";
    Terminy.find({grade: 1, year: 2018})
    .then(function(wszystkieTerminy){
    res.render("registration/zapisy", {wszystkieTerminy, klasy}); 
    })
    .catch(function(err){
        console.log(err);
        res.send("wystąpił błąd");
    })
});

//drugi rok
router.get("/drugi-rok", function (req, res){
    var klasy = "VIII szkoły podstawowej";
    Terminy.find({grade: 2, year: 2018})
    .then(function(wszystkieTerminy){
    res.render("registration/zapisy", {wszystkieTerminy, klasy}); 
    })
    .catch(function(err){
        console.log(err);
        res.send("wystąpił błąd");
    })
});

//trzeci rok
router.get("/trzeci-rok", function (req, res){
    var klasy = "III gimnazjum";
    Terminy.find({grade: 3, year: 2018})
    .then(function(wszystkieTerminy){
    res.render("registration/zapisy", {wszystkieTerminy, klasy}); 
    })
    .catch(function(err){
        console.log(err);
        res.send("wystąpił błąd");
    })
});

//--------------------------------------------
//Zapisywanie studenta
//--------------------------------------------


router.post("/", function (req, res){
    Students.create(req.body.student)
    .then(function(student) {
        Terminy.findById(student.group)
        .then(function(termin){
            
            termin.students.push(student._id);
            termin.save(function(err){
                if (err) {
                    console.log(err);
                    var color = "red";
                    var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
                    res.render("registration/success", {color, message});
                } else {
                    console.log("Everything Saved!!");
                    var color = "green";
                    var message = "Zostałeś zapisany, dziękujemy!";
                    res.render("registration/success", {color, message});
                }
            });
        })
        .catch(function(err){
            console.log(err);
            var color = "red";
            var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
            res.render("registration/success", {color, message});
        })
    })
    .catch(function(err){
        console.log(err);
        var color = "red";
        var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
        res.render("registration/success", {color, message});
    })
})

//--------------------------------------------
//Ekran po zapisie
//--------------------------------------------
router.get("/potwierdzenie", function(req, res){
    res.render("registration/success");
})


module.exports = router;