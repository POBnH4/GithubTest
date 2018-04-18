const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(bodyParser.urlencoded({extended: true}))
// set the view engine to ejs
app.set('view engine', 'ejs');

var db;

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('listening');
});

//you need to complete these

app.get('/', function(req,res) {
  res.render('/index.html')
});

app.get('/userDetails', function(req,res) {
    if(db.collection('users').find(req.body).count() == 0){
        alert("Incorrect username or password!" +
             "If you don't have an account please" +
             " click the button register below.");
        //shouldnt be an alert!
    }else{
      // login in
    }
});

app.get('/registerDetails', function(req,res) {
  if(db.collection('users').find(req.body).count() == 0){
      var varUsername = req.body.email, varName = req.body.name, varPassword = req.body.password;
      db.users.insert(
        {
          email: req.body.email,
          name:req.body.name,
          password: req.body.password
        }
      )
  }else{
      alert("A user already exists with the email!");
  }
});


// - - - - - -  - -  -  SEND AN EMAIL WITH A NEW PASSWORD -   -   -   -   -   -   -


function getRandomPassword(){

  const LENGTH_OF_PASSWORD = 16;
  const CHANCE_OF_A_NUMBER = 20;
  const MAKE_THE_NUMBER_IN_HALF = 2;
  const MAKE_CHANCE_SMALLER = 4;

  var alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
  var numbers = "0123456789";
  var newPassword = "";

  //if the gate number is more than half of the password's length
  //add a random number(character) to the newPassword string;
  //else add a random lowercase/Uppercase letter to the newPassword string;

  for(var i = 0; i < LENGTH_OF_PASSWORD; i++){
    var gate = Math.floor(Math.random() * CHANCE_OF_A_NUMBER);
    if(gate >= (CHANCE_OF_A_NUMBER / MAKE_THE_NUMBER_IN_HALF) + MAKE_CHANCE_SMALLER){
      var randomNumber = Math.floor(Math.random() * numbers.length);
      newPassword += numbers.charAt(randomNumber);
    }else{
      var randomLetter = Math.floor(Math.random() * alphabet.length);
      newPassword += alphabet.charAt(randomLetter);
    }
  }
  return newPassword;
}

app.get('/forgottenPasswordDetails', function(req,res) {
  var nodemailer = require('nodemailer');
  var newPassword = getRandomPassword();
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  });

  var mailOptions = {
    from: 'youremail@gmail.com',
    to: req.body.email,
    subject: 'MunroSpotter reset password',
    text: 'Greetings, Mr/Mrs.Your new password is: ' + newPassword
  };

  if(db.collection('users').find(req.body.email).count() == 1){

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }else{
      alert("A user already exists with the email!");
      //SHOULDNT BE AN ALERT!
  }

});


//-     -   -   -   -   -   -   -  REGISTER -  -   -   -      -   -   -   -   -

app.post('/register', function (req, res) {
  db.collection('users').insert(req.body, function(err, result) {
    if (err) throw err;
    console.log('saved to database')
    res.redirect('/')
  })
})
