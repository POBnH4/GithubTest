var express = require('express');
var app = express();
var knockknock = require('knock-knock-jokes');

app.get('/getform', function(req, res){
var name = req.query.name;
var quest = req.query.quest;
 res.send("Hi "+name+" I am sure you will "+quest) ;
});
