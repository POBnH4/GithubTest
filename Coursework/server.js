const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const USER_DOES_NOT_EXIST = 0, USER_EXISTS = 1;

const USERNAME_VALIDITY = new RegExp("[a-zA-Z0-9]{6,18}"); // username = email;
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
    db.collection('users').count({"username": req.body.username, "password" : req.body.password}).then((occurrences) => {
         if(occurrences >= USER_EXISTS){
             req.session.loggedin = true;
             console.log(req.body.username + ' logged in');
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
         db.collection('users').count({"username":req.body.username, "password": req.body.password}).then((occurrences) => {
             if(occurrences == USER_DOES_NOT_EXIST){

               var correctUsername = false,correctPassword = false;
               if(USERNAME_VALIDITY.test(req.body.username)){
                 correctUsername = true;
               }else{
                 console.log('Username should be: between 6 and 18 characters(only letters and numbers, no special characters)');
               }

               if(PASSWORD_VALIDITY.test(req.body.password)){
                correctPassword = true;
               }else{
                 console.log("Password should contain: 1 lowercase,1 uppercase, 1 digit, between 8 and 20 characters");
               }

               if(correctUsername && correctPassword){
                 var info = {
                   "username": req.body.username,
                   "email": req.body.email,
                   "name":req.body.name,
                   "password": req.body.password
                 };
                 db.collection('users').save(info, function(err, result) {
                   if (err) throw err;
                   console.log(req.body.username + ' saved to database');
                   res.redirect('/');
                 })
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
  nodemailer.createTestAccount((err, account) => {
  var newPassword = getRandomPassword();
  console.log(newPassword + " the new password for the user");
  let transporter = nodemailer.createTransport({
    //smtp = simple mail transfer protocol, it's from the nodemailer library;
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user, // munroSpotter@gmail.com - account username;
      pass: account.pass  // Munrospotter1 - account password;
    },
    logger: false,
    debug: false //smtp includes traffic in the logs
  });

  let mailOptions = {
    from: 'munroSpotter@gmail.com',
    to: userEmail,
    subject: 'MunroSpotter new password',
    text: 'Greetings, Mr/Mrs.+ ' + ' ' +  '\nYour new password is: ' + newPassword
    //name of user missing above
  }

  db.collection('users').count({"email":req.body.email}).then((occurrences) => {
      if(occurrences >= USER_EXISTS){
        transporter.sendMail(mailOptions, function(error, info){
          if (error) { console.log(error);}
          console.log('Message sent' );
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
      }else{
        console.log('connection not established!');
      }
  });
        // var user = {}
        // var newValues = {$set: {}};
        // db.collection('users').updateOne(user,newValues, function(err,result){
        //   if(err) throw err;
        //   res.redirect('/');
        // });
 });
});
