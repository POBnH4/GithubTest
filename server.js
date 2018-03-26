var express = require('express');
var app = express();
app.get('/', function(req,res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  var randomJoke = knockknock();
  res.end(randomJoke);
});
