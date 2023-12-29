const createError = require('http-errors');
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');

//---------------------winston logger-begin---------------------------------------------
const winston = require('winston');
// Создайте логгер с несколькими транспортами (куда записывать логи)
const log = winston.createLogger({
  level: 'info', // уровень логирования
  format: winston.format.simple(), // формат вывода
  transports: [
    // new winston.transports.Console(), // вывод в консоль
    new winston.transports.File({ filename: 'logfile.log' }) // вывод в файл
  ]
});
// log.info('Это информационное сообщение.');
// log.warn('Это предупреждение.');
// log.error('Это сообщение об ошибке.');
//process.on events: 'beforeExit', 'disconnect', 'exit', 'rejectionHandled', 'uncaughtException',
// 'uncaughtExceptionMonitor', 'unhandledRejection', 'warning', 'message'
process.on('uncaughtException', (err) => {
  // Запись ошибки в лог
  let d = new Date();
  let fd = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  // console.log(err);
  log.error(fd + '\n' + err.stack + '\n\n');
  // Дополнительно можно выполнять другие действия, например, завершить процесс
  process.exit(1);
});
process.on('exit', (code) => {
  // console.log(`Процесс завершен с кодом: ${code}`);
  log.error(`${new Date()}::: Exit with code: ${code}`);
  // process.exit(1);
});
//---------------------winston logger-end---------------------------------------------

const webRouter = require('./routes/web');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//------------------set layouts----------------------------------
app.use(require('express-ejs-layouts'));
app.set('layout', 'layouts/main');

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// // setup the logger
// app.use(logger('combined', { stream: accessLogStream }));
// app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//--------------------------------------------------------------------

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
