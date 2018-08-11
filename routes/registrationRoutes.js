var express = require("express");
var router = express.Router();
var Terminy = require("../models/terminy");
var Students = require("../models/students");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIDAPI);
//routes

const msg = {
  from: 'admin@bierzmowaniekurdwanow.pl',
  subject: '[Zapisy na Sakrament Bierzmowania] Proszę potwierdzić zgłoszenie'
  
};


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
    let student = req.body.student;
    student.mailHash = generateRandom();
    Students.create(student)
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
                    msg.to = student.email;
                    msg.html = `<strong>Aby potwierdzić swoje zgłoszenie proszę kliknąć w link: <a href="http://bierzmowaniekurdwanow.pl/zapisy/weryfikacja/${student.mailHash}">LINK</a></strong>`,
                    console.log(msg.html);
                    sgMail.send(msg);
                    console.log("Everything Saved!!");
                    var color = "green";
                    var message = 'Twoje zgłoszenie zostało wysłane ale nie jest jeszcze potwierdzone! Aby być wpisanym na listę kliknij w link wysłany na Twój adres e-mail w celu weryfikacji. Jeśli nie dotarła do Ciebie wiadomość sprawdź koniecznie w folderze ze spamem albo w innych folderach w których mogą znajdować się wiadomości jak np. "powiadomienia", "oferty", "społeczności". Jeśli wiadomość mimo wszystko nie dotarła prosimy o kontakt pod adresem admin@bierzmowaniekurdwanow.pl by zostać wpisanym na listę.';
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
    
});
//--------------------------------------------
//Weryfikazja e-mail
//--------------------------------------------

router.get("/weryfikacja/:mHash", function(req, res){
    let mHash = req.params.mHash;
    Students.findOne({mailHash: mHash})
    .then(function(student){
        console.log(student.mailHash);
        console.log(mHash);
        if (student.mailHash == mHash) {
            if (student.verificated == true){
                var color = "green";
                var message = "Twoje zgłoszenie zostało już zweryfikowane!";
                res.render("registration/success", {color, message});
            } else {
                student.verificated = true;
                student.save();
                var color = "green";
                var message = `Twoje zgłoszenie zostało zweryfikowane! Jesteś zapisany/a do grupy.`;
                res.render("registration/success", {color, message});
            }
        } else {
            var color = "red";
            var message = "Nie ubało się zweryfikować Twojego adresu Email. Aby potwierdzić zgłoszenie prosimy o kontakt z administratorem. Email: admin@bierzmowaniekurdwanow.pl";
            res.render("registration/success", {color, message});
        }
    })
    .catch(function(err){
        console.log(err);
        var color = "red";
        var message = "Nie ubało się zweryfikować Twojego adresu Email. Aby potwierdzić zgłoszenie prosimy o kontakt z administratorem. Email: admin@bierzmowaniekurdwanow.pl";
        res.render("registration/success", {color, message});
        })
});

//--------------------------------------------
//Functions
//--------------------------------------------

function generateRandom() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


module.exports = router;