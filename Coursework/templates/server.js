/**
 * Created by 1603232 on 09/04/2018.
 */

// server.js

/*
var express = require('express');
var app = express();
*/

//Required packages
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/munrospotter";
const express = require('express'); //npm install express
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
const app = express();

//tell express to use sessions
app.use(session({secret: 'example'}));

app.use(bodyParser.urlencoded({
    extended: true
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

//Set folder for static files (css/js/json/img)
app.use(express.static("public"));

var db;

//Connection to MongoDB - sets the variable db as our database
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('listening on 8080');
});


/*
-----
---------- ROUTES ----------
-----
*/

// use res.render to load ejs view file

// index page - root route
app.get('/', function(req,res) {
    res.render('pages/index');
});

// map page
app.get('/munromap', function(req,res) {

    /*
    //if user not logged in - don't show "bagged" marker
    if (!req.session.loggedin) {
        res.redirect('')
    }

    */
/*
    db.collection('munros').find().toArray(function(err,result,session) {
        if (err) throw err;
        res.render('pages/map', {
            usession: session
        })
    });
*/

    session.loggedin = true;
/*
    // db.collection('munros').find().toArray(function(err,result) {
    //     if (err) throw err;
        // console.log(result);
        // res.send(result);
        res.render('pages/map', {
            usession: session
        })
    });
*/


    session.loggedin = true;

    res.render('pages/map', {
        usession: session
    });




});


app.get('/munros', function(res,req) {
    db.collection('munros').find({},function(err,result){
        res.send(result);
    });
});


// list page
app.get('/munrolist', function(req,res) {
    res.render('pages/list');
});

// info page
app.get('/information', function(req,res) {
    res.render('pages/info');
});

// contact page
app.get('/contact', function(req,res) {
    res.render('pages/contact');
});

// login page
app.get('/login', function(req,res) {
    res.render('pages/login');
});

// app.listen(8080);