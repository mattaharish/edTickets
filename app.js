var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config/config.js');
var session = require('express-session');
var cors = require('cors');

mongoose.connect(config.db);
var db = mongoose.connection;

db.on('connected', function () {
  console.log("Conneted to db..");
});

// Init App
var app = express();
app.use(cors());

//Logger
app.use(morgan('dev'));

//session
app.use(session({
  secret: "s3cr3t"
}));

// BodyParser Middleware
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

//Set view to angular folder
app.use(express.static(path.join(__dirname, '/public')));

//Setting routes main file
app.use('/', require('./app/controllers/index.js'));

// Set Port
app.set('port', (process.env.PORT || 3000));

// catch 404 and forward to error handler
app.get('*', function (req, res, next) {
  req.status = 404;
  next("Page Not Found!!");
});

// error handler
app.use(function (err, req, res, next) {
  res.send(err);
});

//listening port
app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});