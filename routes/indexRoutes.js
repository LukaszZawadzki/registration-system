var express = require("express");
var router = express.Router();
var Terminy = require("../models/terminy")

//root route
router.get("/", function(req, res){
    /*Terminy.find({}, function(err, wszystkieTerminy){
        if (err) {
            console.log(err)
        } else {*/
            res.render("landing"/*, {wszystkieTerminy}*/);
        /*}
    })*/
});
// creating termin - TO DELETE OR REFABRISH!!!!!!!!!!!!!!!!!!!!!!!
router.post("/", function(req, res){
    console.log(req.body);
    console.log(req.body.terminy);
    Terminy.create(req.body.terminy, function(err, termin){
        if (err) {
            console.log(err);
        } else {
            res.send("termin dodany");
        }
    })
})

module.exports = router;
