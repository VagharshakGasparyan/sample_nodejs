const express = require('express');
const {DB} = require("../components/db");
const router = express.Router();
const {User, Product} = require("../models");

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('pages/home', {title: 'Home', page:'home'});
});
router.get('/products', async (req, res, next) => {
    // res.location('/login');
    // res.get('location');
    // res.redirect('/about');
    //res.redirect(status: number, url: string): void;
    //res.redirect(status: number, url: string): void;
    // console.log(User.);
    // const user = new User({ id: 1 });
    // console.log(user.id);
    let products = [];
    try {
        products = await Product.findAll({limit: 10});
        // const jane = await User.create({ first_name: "Jane", last_name: "Doe", email: "johnDoe@gmail.com" });
    }catch (e) {
        console.log('error=', e);
    }

    // let products = DB('SELECT * FROM `products` LIMIT 3');
    // console.log(products);
    res.render('pages/products', {title: 'Products', page:'products', products: products});
});
module.exports = router;
