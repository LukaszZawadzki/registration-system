var express = require("express");
var router = express.Router();
var Terminy = require("../models/terminy");
var Students = require("../models/students");
const sgMail = require('@sendgrid/mail');
var fs = require("fs");
sgMail.setApiKey(process.env.SENDGRIDAPI);
//routes

const msg = {
  from: 'admin@bierzmowaniekurdwanow.pl',
  subject: '[Zapisy na Sakrament Bierzmowania] Proszę potwierdzić zgłoszenie'
  
};


//pierwszy rok
router.get("/pierwszy-rok", function (req, res){
    var klasy = "VII szkoły podstawowej";
    Terminy.find({grade: 1, year: 2018},{},{sort:{
        name: 1
    }}).populate({
        path: 'students',
        match: { active: true },
        select: 'active -_id',
    })
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
    Terminy.find({grade: 2, year: 2018},{},{sort:{
        name: 1
    }}).populate({
        path: 'students',
        match: { active: true },
        select: 'active -_id',
    })
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
    Terminy.find({grade: 3, year: 2018},{},{sort:{
        name: 1
    }}).populate({
        path: 'students',
        match: { active: true },
        select: 'active -_id',
    })
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


router.post("/", checkEmail, function (req, res){
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
                    let klasy = "";
                    if(termin.grade == 1) {
                        klasy = "VII szkoły podstawowej";
                    }                    
                    if(termin.grade == 2) {
                        klasy = "VIII szkoły podstawowej";
                    }                    
                    if(termin.grade == 3) {
                        klasy = "III gimnazjum";
                    }
                    msg.html = `<p>Dziękujemy za zgłoszenie!</br></br>
                    <strong>Aby je potwierdzić proszę kliknąć w link: <a href="https://bierzmowaniekurdwanow.pl/zapisy/weryfikacja/${student.mailHash}">LINK</a></strong></p>
                    <p>Po potwierdzeniu zgłoszenia będziesz zapisany/a do grupy w ${termin.day} o godzinie ${termin.hour} dla klas ${klasy}.</p>
                    </br>
                    <p>Z Bogiem,</br>
                    Parafia Podwyższenia Krzyża Świętego w Krakowie</p>`;
                    console.log(msg.html);
                    if (process.env.SENDGRID_ON) {
                        sgMail.send(msg)
                        .then(function(message){
                            console.log("Everything Saved!!");
                            var color = "green";
                            saveData(`./backup/students/${student.name}_${student.lastname}_${Date.now().toString()}.json`, JSON.stringify(student)/*.toString()*/, "utf8");
                            var message = '<h2 style="color: green;">Twoje zgłoszenie zostało wysłane ale nie jest jeszcze potwierdzone!</h2><h3 style="color: green;">Aby być wpisanym na listę kliknij w link wysłany na Twój adres e-mail w celu weryfikacji.</h3><p>Jeśli nie dotarła do Ciebie wiadomość sprawdź koniecznie w folderze ze spamem albo w innych folderach w których mogą znajdować się wiadomości jak np. "powiadomienia", "oferty", "społeczności". Jeśli wiadomość mimo wszystko nie dotarła prosimy o kontakt pod adresem admin@bierzmowaniekurdwanow.pl by zostać wpisanym na listę.</p>';
                            res.render("registration/registrationSuccess", {color, message});
                        })
                        .catch(function(error){
                            console.log(error);
                            var color = "red";
                            var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
                            res.render("registration/success", {color, message});
                        });
                    } else {
                            console.log("Everything Saved!! - without sending email");
                            var color = "green";
                            var message = '<h2>Twoje zgłoszenie zostało wysłane ale nie jest jeszcze potwierdzone!</h2><h2>Aby być wpisanym na listę kliknij w link wysłany na Twój adres e-mail w celu weryfikacji.</h2><p>Jeśli nie dotarła do Ciebie wiadomość sprawdź koniecznie w folderze ze spamem albo w innych folderach w których mogą znajdować się wiadomości jak np. "powiadomienia", "oferty", "społeczności". Jeśli wiadomość mimo wszystko nie dotarła prosimy o kontakt pod adresem admin@bierzmowaniekurdwanow.pl by zostać wpisanym na listę.</p>';
                            res.render("registration/success", {color, message});
                    }
                    
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

// functions
function saveData(filename, data, encoding) {
    fs.writeFile(filename, data, encoding, function(error){
            if(error){
                console.log(error);
            };
            console.log("file writen");
        })
};

function generateRandom() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function checkEmail(req, res, next){
    let student = req.body.student;
    Students.findOne({email: student.email})
    .then(function(foundStudent){
        if (foundStudent != null){
            var color = "red";
            var message = "Twój adres e-mail jest już w naszej bazie danych, jedna osoba może dokonać tylko jednego zgłoszenia";
            res.render("registration/success", {color, message});
        } else {
            next();
        }
    })
    .catch(function(err){
        console.log(err);
        var color = "red";
        var message = "Wystąpił błąd, prosimy o kontakt z administratorem!";
        res.render("registration/success", {color, message});
    })
};



module.exports = router;