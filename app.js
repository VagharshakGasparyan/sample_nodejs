const express = require('express');
const app = express();
const path = require('node:path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const cron = require('node-cron');
require('dotenv').config();
// require("./components/logger");
// const fs = require("node:fs");
const {exec, spawn} = require("node:child_process");
const fileUpload = require("express-fileupload");
//-------------------MongoDB-------------------------------------------------------
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('test_db');
const users = db.collection('users');
const products = db.collection('products');
(async ()=>{
    let ans = await users.find({email: "vvagharshak@gmail.com"}).toArray();
    console.log(ans);
    // await users.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    // await products.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);

    // await db.createCollection('tickets', {
    //     clusteredIndex: { "key": { _id: 1 }, "unique": true, "name": "stocks clustered key" }
    // });
    // await products.insertMany([
    //     { "_id": 1, "name": "apples", "qty": 5, "rating": 3 },
    //     { "_id": 2, "name": "bananas", "qty": 7, "rating": 1 },
    //     { "_id": 3, "name": "oranges", "qty": 6, "rating": 2 },
    //     { "_id": 4, "name": "avocados", "qty": 3, "rating": 5 },
    // ]);
    // const deleteResult = await users.deleteMany({ email: "vvagharshak@gmail.com" });
    // console.log('Deleted documents =>', deleteResult);
})();

//client.close();
const mongoose = require('mongoose');
try {
    (async ()=>{
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/test_db');
        console.log('Mongo DB Connected!');
        // let f =  await User.find({email:"vvagharshak@gmail.com"});
        // console.log(f);
        // await db.mquery.createCollection("posts");
        // let ans = await db.users.find({email: "vvagharshak@gmail.com"});
        // console.log(db);
    })();
}catch (e) {
    console.log('Mongo DB Connection error.', e);
}
// mongoose.connect('mongodb://127.0.0.1:27017/test_db')
//     .then(() => console.log('Mongo DB Connected!'));

//---------------------------------------------------------------------------------
// console.log(">>>>>>>>>>started");
//-------------------------------cors----------------------------------------------
app.use(cors({
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
//-------------------------------global functions----------------------------------
require("./components/globalFunctions")(__dirname);
//---------------------cron jobs-begin---------------------------------------------
require("./jobs/sessionCleaner");
require("./jobs/logFileCleaner");
//---------------------cron jobs-end-----------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//------------------set layouts----------------------------------------------------
app.use(require('express-ejs-layouts'));
app.set('layout', 'layouts/main');

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    // useTempFiles : true,
    // tempFileDir : __dirname + '/tmp',
    // safeFileNames: true,
    // preserveExtension: true,
}));

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

app.use('/', require('./routes/web'));
app.use('/api/v1', require('./routes/api_v1'));

require("./middleware/errors")(app);

module.exports = app;
