require("dotenv").config({ path: ".env" });

var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
passport = require("passport"),
User = require("./models/user"),
LocalStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
mongoose = require("mongoose");


app.use(bodyParser.urlencoded({extended: true}));
//--------------------------------------------
//ROUTES
//--------------------------------------------
var indexRoutes = require("./routes/indexRoutes"),
    registrationRoutes = require("./routes/registrationRoutes"),
    administrationRoutes = require("./routes/administrationRoutes"),
    backupRoutes = require("./routes/backupRoutes");
//-------------------------------------------

//--------------------------------------------
//PUBLICFOLDERS
//--------------------------------------------
app.use(express.static(__dirname + "/public"));

//--------------------------------------------
//DATABASE
//--------------------------------------------

mongoose.connect(process.env.DATABASE_PATH, { useNewUrlParser: true });

//--------------------------------------------
//CONFIGURATION
//--------------------------------------------
app.set("view engine", "ejs");

//--------------------------------------------
//Authentication
//--------------------------------------------
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 4 },
    store: new (require('express-sessions'))({
        storage: 'mongodb',
        instance: mongoose,
        collection: 'sessions', // optional
        expire: 60 * 60 * 4 // optional
    })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", indexRoutes);
app.use("/zapisy", registrationRoutes);
app.use("/administracja", administrationRoutes);
app.use("/backup", backupRoutes);


//--------------------------------------------
//LISTEN
//--------------------------------------------
app.listen(process.env.PORT || 8080, function (err) {
    if(err){
        console.log(err);
    }
    console.log("Registration System is Running!!");
})

