var express = require('express');
var app = express();
var knockknock = require('knock-knock-jokes');

app.get('/joke', function(req,res){
  res.writeHead(200,{'Content-Type' : 'text/html'});
  var randomJoke = knockknock()
  res.end(randomJoke);
}).listen(8080);
