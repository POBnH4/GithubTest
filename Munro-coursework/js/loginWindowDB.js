const MongoClient = require('mongodb').MongoClient;
const expess = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

var db;
MongoClient.connect(url,function(err,database){
  if(err) throw err;
  db = database;
  app.listen(8080);
});

app.post('/userDetails', function(req,res){
  db.collection('quotes').save(req.body, body(err,result){
      if(err) throw err;
      console.log('Registration Successful!');
      res.redirect('/')
  })
})
