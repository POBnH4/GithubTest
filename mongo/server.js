const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/star_wars_quotes";
const express = require('express');
const app = express();
app.use(express.static('public'))
var db;
MongoClient.connect(url, function(err, database){
 if(err) throw err;
 db = database;
 app.listen(8080);
});
