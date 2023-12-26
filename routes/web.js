const express = require('express');
const {DB} = require("../components/db");
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('pages/home', {title: 'Home', page:'home'});
});
router.get('/products', (req, res, next) => {
    // res.location('/login');
    // res.get('location');
    // res.redirect('/about');
    //res.redirect(status: number, url: string): void;
    //res.redirect(status: number, url: string): void;
    let products = DB('SELECT * FROM `products` LIMIT 3');
    // console.log(products);
    res.render('pages/products', {title: 'Products', page:'products', products: products});
});
module.exports = router;
