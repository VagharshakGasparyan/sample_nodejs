const createError = require('http-errors');
const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const webRouter = require('./routes/web');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//------------------set layouts----------------------------------
app.use(require('express-ejs-layouts'));
app.set('layout', 'layouts/main');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//----------------------------middleware------------------------------
app.use(function(req, res, next) {
  //res.on events: 'close', 'drain', 'error', 'finish', 'pipe', 'unpipe'
  // res.on('close', function(){
  //   console.log('res.locals=', res.locals.products);
  // });

  res.locals.fullUrl = {
    protocol: req.protocol,
    host: req.get('host'),
    path: req.path,
    query: req.query,
  };
  next();
});
app.use('/', webRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // res.locals.defineContent = function(contentName) { return res.locals[contentName] || ''; };
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('errors/error');
});

module.exports = app;
