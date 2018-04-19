const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const USER_DOES_NOT_EXIST = 0, USER_EXISTS = 1;
const PASSWORD_VALIDITY = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})");
//the password must contain at least one lowercase letter,
// one uppercase letter, one digit, and be between 8 and 20 characters;
app.use(session({ secret: 'example'}));
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

app.post('/userDetails', function(req,res) {
  // db.collection("users").findOne({"email": req.body.email, "password" : req.body.password}, function(err, result) {
  //   if (err) throw err;
  //   console.log(result.name lo);
  //   db.close();
  // });
    db.collection('users').count({"email": req.body.email, "password" : req.body.password}).then((occurences) => {
         if(occurences >= USER_EXISTS){
             req.session.loggedin = true;
             console.log(req.body.email + ' logged in');
             // login in information....
         }else{
           console.log('You username or password is incorrect');
         }
    });
});


//- - - - - -  -- - - -  - -LOGOUT - - -- - - - -- - - - - - -

app.get('/logout', function(req,res){
  req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/')
});


//- - - -- - - -- - - - REGISTER  - - - - - - - - - - - - - -  --




       app.post('/registerDetails', function (req,res){
         db.collection('users').count({"email":req.body.email, "password": req.body.password}).then((occurences) => {
             if(occurences == USER_DOES_NOT_EXIST){

               if(PASSWORD_VALIDITY.test(req.body.password)){

                 var info = {
                   "email": req.body.email,
                   "name":req.body.name,
                   "password": req.body.password
                 };
                 db.collection('users').save(info, function(err, result) {
                   if (err) throw err;
                   console.log('Saved to database');
                   res.redirect('/');
                 })

               }else{
                 console.log("Password should contain: 1 lowercase,1 uppercase, 1 digit, between 8 and 20 characters");
               }
            }else{
              console.log("User already exists with that email!");
              res.redirect('/');
            }
          });
        });

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
  var newPassword = getRandomPassword();
  console.log(newPassword + " the new password for the user");
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'munrospotter@yahoo.com',
      pass: 'JustinBieberFan1'
    }
  });

  var mailOptions = {
    from: 'munrospotter@yahoo.com',
    to: req.body.email,
    subject: 'MunroSpotter new password',
    text: 'Greetings, Mr/Mrs.+ ' + 'Your new password is: ' + newPassword
     // get a person's name from the database and add it after Mr/Mrs.
  }

  db.collection('users').find("email":req.body.email).count() == USER_EXISTS){
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
});
