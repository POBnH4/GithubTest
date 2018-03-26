var express = require('express');
var app = express();
app.get('/', function(req,res){
  var randomJoke = knockknock();
  res.send(randomJoke);
});
