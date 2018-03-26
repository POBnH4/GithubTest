
var http = require('http');
var knockknock = require('knock-knock-jokes');
app.get('/joke', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
 var randomJoke = knockknock()
  res.end(randomJoke);
});
app.listen(8080);
