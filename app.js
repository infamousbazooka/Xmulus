var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');

var firebase = require('firebase');

var index = require('./routes/index');
var dashboard = require('./routes/dashboard');

var app = express();

// Locals
app.locals.moment = moment;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  console.log(req.url)
  if(req.url === '/' || req.url === '/Login' || req.url === "/Register") {
    next()
  } else {
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
      if(firebaseUser) {
        req.user = {}
        req.user.email = firebaseUser.email;
        app.locals.userEmail = firebaseUser.email;
        next()
      } else {
        res.redirect('/Login');
      }
    })
  }
});
app.use('/', index);
app.use('/Home', index);
app.use('/Login', index);
app.use('/Register', index);
app.use('/Dashboard', dashboard.list);
app.use('/Dashboard/Movies/', index);
app.use('/Dashboard/Watchlist/', index);
app.use('/Dashboard/Movies/', index);
app.use('/Logout', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log("Error: " + err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
