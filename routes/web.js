const express = require('express');
const {DB} = require("../components/db");
const router = express.Router();
const {Op} = require("sequelize");
const {User, Product} = require("../models");
const {normalizeTypes} = require("express/lib/utils");
const bcrypt = require("bcrypt");
const {query, check, validationResult, checkSchema} = require('express-validator');
const moment = require('moment');


/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('pages/home', {title: 'Home', page: 'home'});
});
router.get('/products', async (req, res, next) => {
    //qwerty
    // res.location('/login');
    // res.get('location');
    // res.redirect('/about');
    //res.redirect(status: number, url: string): void;
    //res.redirect(status: number, url: string): void;
    // console.log(User.);
    // const user = new User({ id: 1 });
    // console.log(user.id);
    // console.log(bcrypt.compareSync('qwerty', '$2b$08$anjueAN9I.ROPfygoSbF2uyqSvpFhwW/ZpIXXgqvG0fd4kTnGAMPa'));

    let products = [];
    try {
        products = await Product.findAll({
            limit: 20,
            where: {brand_id: {[Op.not]: null}},
            order: [['id', 'ASC']]
        });
        // const jane = await User.create({ first_name: "Jane", last_name: "Doe", email: "johnDoe@gmail.com" });
    } catch (e) {
        console.error('error=', e);
    }
    // let products = DB('SELECT * FROM `products` LIMIT 3');
    // console.log(products);
    res.render('pages/products', {title: 'Products', page: 'products', products: products});
});
router.get('/login', async (req, res, next) => {
    // console.log(moment().format('yyyy_MM_DD_HH:mm:ss'));
    res.render('pages/login', {title: 'Login', page: 'login'});
});
router.post('/login', async (req, res, next) => {

    await checkSchema({
        email: {isEmail: true},
        password: {isLength: {options: {min: 8, max: 20}}},
    }).run(req);
    //await check('email', 'Username Must Be an Email Address').isEmail().run(req);
    //await check('password').isLength({ min: 8, max: 20 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = {};
        errors.array().forEach((err_item)=>{
            req.session.errors[err_item.path] = err_item;
        });
        let backURL = req.header('Referer') || '/';
        return res.redirect(backURL);
    }
    // console.log(req.body);
    res.redirect('/');
});


module.exports = router;
