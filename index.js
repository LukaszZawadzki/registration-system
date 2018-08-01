require("dotenv").config({ path: ".env" });

var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose");


app.use(bodyParser.urlencoded({extended: true}));
//--------------------------------------------
//ROUTES
//--------------------------------------------
var indexRoutes = require("./routes/indexRoutes"),
    registrationRoutes = require("./routes/registrationRoutes");
//-------------------------------------------
app.use("/", indexRoutes);
app.use("/zapisy", registrationRoutes);

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
//LISTEN
//--------------------------------------------
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Registration System is Running!!");
})