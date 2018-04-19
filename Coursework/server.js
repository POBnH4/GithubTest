const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PASSWORD_VALIDITY = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})");
//the password must contain at least one lowercase letter,
// one uppercase letter, one digit, and be between 8 and 20 characters;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

var db;

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080); 
  console.log('listening....');
});

app.get('/', function(req,res) {
  res.render('index')
});

// ----- - - - - - - - - - LOGIN --- - - - - - - -- - - - --  - --

app.get('/userDetails', function(req,res) {
    if(db.collection('users').find(req.body).count() == 0){
        alert("Incorrect username or password!" +
             "If you don't have an account please" +
             " click the button register below.");
        //shouldnt be an alert!
    }else{
      // login in information....
    }
});


//- - - -- - - -- - - - REGISTER  - - - - - - - - - - - - - -  --


// if(passwordValidity.test(req.body.password)){
//   register...
// }else{
//   alert("You password must contain at least one lowercase letter," +
//    "one uppercase letter, one digit, and be between 8 and 20 characters;")
// }

function registerNewUser(){
 app.get('/registerDetails', function(req,res) {
  if(db.collection('users').find(req.body).count() == 0){

      var info = {
         email: req.body.email,
         name:req.body.name,
         password: req.body.password
       };

       app.post('/registerDetails', function (req,res){
         db.collection('users').save(info, function(err, result) {
           if (err) throw err;
           console.log('Saved to database')
           alert("You have officially registered!");
           res.redirect('/')
         });
       });

     }else{
          alert("A user already exists with the email!");
     }
  });
}


// - - - - - -  - -  -  SEND AN EMAIL WITH A NEW PASSWORD -   -   -   -   -   -   -


function getRandomPassword(){

  const LENGTH_OF_PASSWORD = 14;
  const CHANCE_OF_A_NUMBER = 20;
  const MAKE_THE_NUMBER_IN_HALF = 2;
  const MAKE_CHANCE_SMALLER = 4;

  var alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
  var numbers = "0123456789";
  var newPassword;

  //if the gate number is more than half of the password's length
  //add a random number(character) to the newPassword string;
  //else add a random lowercase/Uppercase letter to the newPassword string;
  while(true){
   newPassword = "";
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
   if(PASSWORD_VALIDITY.test(newPassword)){ break;}
  }
  return newPassword;
}

app.get('/forgottenPasswordDetails', function(req,res) {
  var nodemailer = require('nodemailer');
  var newPassword = getRandomPassword();
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'myEmail@gmail.com',
      pass: 'myPassword'
    }
  });

  var mailOptions = {
    from: 'myEmail@gmail.com',
    to: req.body.email,
    subject: 'MunroSpotter reset password',
    text: 'Greetings, Mr/Mrs.+ ' + 'Your new password is: ' + newPassword
     // get a person's name from the database and add it after Mr/Mrs.
  };

  if(db.collection('users').find(req.body.email).count() == 1){
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);

        // var user = {}
        // var newValues = {$set: {}};
        // db.collection('users').updateOne(user,newValues, function(err,result){
        //   if(err) throw err;
        //   res.redirect('/');
        // });

      }
    });
  }else{
      alert("A user already exists with the email!");
      //SHOULDNT BE AN ALERT!
  }

});
