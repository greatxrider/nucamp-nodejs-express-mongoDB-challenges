var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionsRouter');
const partnerRouter = require('./routes/partnersRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {});

var app = express();

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

// app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore({
    path: './sessions', // Specify the path explicitly
    retries: 0 // Set the number of retries to 0 to prevent retries
  })
}));

app.use(express.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(passport.initialize());
app.use(passport.session());

//authentication
const auth = (req, res, next) => {
  console.log(req.session);

  if (!req.isAuthenticated()) {
    const err = new Error('You are not authenticated');
    err.status = 401;
    return next(err);
  } else {
    return next();
  }
};

app.use(auth);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
