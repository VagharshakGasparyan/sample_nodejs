const express = require('express');
const {DB} = require("../components/db");
const router = express.Router();
const {Op} = require("sequelize");
const {User, Product} = require("../models");
const {normalizeTypes} = require("express/lib/utils");
const bcrypt = require("bcrypt");
const {query, check, validationResult, checkSchema} = require('express-validator');
const moment = require('moment');
const Joi = require('joi');
const {validate} = require('../components/validate');
const {generateToken, loginUser} = require('../components/functions');


/* GET home page. */
router.get('/', (req, res, next) => {
    // app.param('id', /^\d+$/);
    // app.get('/user/:id', function(req, res){
    //     res.send('user ' + req.params.id);
    // });
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
    // console.log(req.session);

    // generateToken(1);
    if(res.locals.$auth){
        return res.redirect('/');
    }

    res.render('pages/login', {title: 'Login', page: 'login'});
});
router.post('/login', async (req, res, next) => {
    if(res.locals.$auth){
        return res.redirect('/');
    }

    if(
        !validate({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(20).required()
        }, req, res)
    ){
        return res.redirectBack();
    }

    const {email, password} = req.body;
    const user = await User.findOne({where: {email: email}});
    if(user){
        if(!bcrypt.compareSync(password, user.dataValues.password)){
            req.session.errors['password'] = 'The password is incorrect.';
            return res.redirectBack();
        }
    }else{
        req.session.errors['email'] = 'The user with this email does not exists.';
        return res.redirectBack();
    }
    loginUser(user.dataValues.id, req, res);

    res.redirect('/');

});


module.exports = router;
