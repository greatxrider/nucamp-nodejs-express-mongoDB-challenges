var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionsRouter');
const partnerRouter = require('./routes/partnersRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();

app.use(express.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
