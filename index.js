//index.js

// Dependencies - general
var express = require('express');
var bodyParser = require('body-parser');
var cn = require('./config.json');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var url = require("url");

//Dependencies - schemas
var Cnf = require('./models/cnf');
var Recins = require('./models/recins');
var User = require('./models/user');

//Dependencies - routing
var cnf = require('./routes/cnf');
var login = require('./routes/login');
var recins = require('./routes/recins');
var user = require('./routes/user');
var install = require('./routes/install');

// Mongo
mongoose.Promise = global.Promise;
mongoose.connect(cn.mongooseConnectionString, {}, function (err, res) {
    if (err) console.log('Error when connecting to Mongodb');
});
var db = mongoose.connection;

// Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disabled('x-powered-by');

// Routing

app.use(cookieParser());
app.use(function (req, res, next){

   var p = url.parse(req.path).pathname;
   if (p.substr(0,5) == '/api/' && p != '/api/login' && p != '/api/install' && req.cookies.token != cn.token) {
      res.status(400).json('no token');  
   } else {
      next();      
   }
});

app.use(express.static('./public'));
app.use('/api/cnf', cnf);
app.use('/api/login', login);
app.use('/api/recins', recins);
app.use('/api/user', user);
app.use('/api/install', install);

// Run
app.listen(cn.serverPort, function() {
  console.log('Server running on localhost:' + cn.serverPort);
});
