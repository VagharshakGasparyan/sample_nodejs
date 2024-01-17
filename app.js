const express = require('express');
const app = express();
const path = require('node:path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cron = require('node-cron');
require('dotenv').config();
const formData = require("express-form-data");
const os = require("os");
require("./components/logger");

//---------------------cron jobs-begin---------------------------------------------
require("./jobs/session_clearener");
//---------------------cron jobs-end---------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//------------------set layouts----------------------------------
app.use(require('express-ejs-layouts'));
app.set('layout', 'layouts/main');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(formData.parse({uploadDir: os.tmpdir(), autoClean: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    name: 'ses',
    secret: 'Fb25ekS7Im',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 10 * 60 * 1000}
}));

app.use(require("./middleware/auth"));
app.use(require("./middleware/api_auth"));

const webRouter = require('./routes/web');
const apiV1Router = require('./routes/api_v1');
app.use('/', webRouter);
app.use('/api/v1', apiV1Router);

require("./middleware/errors")(app);

module.exports = app;
