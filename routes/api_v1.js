const express = require('express');
const router = express.Router();

// var app = require('express');
// require('express-group-routes');
const {validate, api_validate, VRequest} = require("../components/validate");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {saveAndGetUserToken, apiLogoutUser} = require("../components/functions");
const fs = require("node:fs");
const md5 = require('md5');
const {extFrom} = require('../components/mimeToExt');
const {UserController} = require('../http/controllers/admin/UserController');
const AdminDataController = require('../http/controllers/admin/AdminDataController');
const TeamsController = require('../http/controllers/TeamsController');
const SettingsController = require('../http/controllers/SettingsController');
const {DB} = require("../components/db");
const ClientController = require("../http/controllers/clientController");
const PortfolioController = require("../http/controllers/portfolioController");
const CategoriesController = require("../http/controllers/categoriesController");

const group = (callback) => {
    callback(router);
    return router;
};

router.get('/client', new ClientController().client);
router.get('/client/teams', new ClientController().teams);
router.get('/client/settings', new ClientController().settings);
router.get('/client/portfolios', new ClientController().portfolios);
router.get('/client/categories', new ClientController().categories);
router.get('/client/team/:team_id([1-9][0-9]{0,})', new ClientController().team);
router.get('/client/setting/:setting_id([1-9][0-9]{0,})', new ClientController().setting);
router.get('/client/setting-key/:setting_key', new ClientController().setting_key);
router.get('/client/portfolio/:portfolio_id([1-9][0-9]{0,})', new ClientController().portfolio);
router.get('/client/category/:category_id([1-9][0-9]{0,})', new ClientController().category);

router.post('/admin/login', new UserController().login);
router.get('/admin/auth/me', new UserController().logged);
router.use('/admin', group((adminRouter)=>{
    adminRouter.use('/admin', (req, res, next)=>{
        // console.log(req.path);
        if(!res.locals.$api_auth.admin){
            res.status(401);
            return res.send({status: 401, message: "Unauthorized"});
        }
        next();
    });
    adminRouter.get('/logout', new UserController().logout);
    //--------------------admin user------------------------------------------------------------------------------------
    adminRouter.post('/user/create', new UserController().create);
    adminRouter.post('/user/update/:user_id([1-9][0-9]{0,})', new UserController().update);
    adminRouter.delete('/user/delete/:user_id([1-9]\\d*)', new UserController().destroy);
    //--------------------admin team------------------------------------------------------------------------------------
    adminRouter.post('/team/create', new TeamsController().create);
    adminRouter.post('/team/update/:team_id([1-9][0-9]{0,})', new TeamsController().update);
    adminRouter.delete('/team/delete/:team_id([1-9][0-9]{0,})', new TeamsController().destroy);
    //--------------------settings--------------------------------------------------------------------------------------
    adminRouter.post('/setting/create', new SettingsController().create);
    adminRouter.post('/setting/update/:setting_id([1-9][0-9]{0,})', new SettingsController().update);
    adminRouter.delete('/setting/delete/:setting_id([1-9][0-9]{0,})', new SettingsController().destroy);
    //--------------------admin portfolio-------------------------------------------------------------------------------
    adminRouter.post('/portfolio/create', new PortfolioController().create);
    adminRouter.post('/portfolio/update/:portfolio_id([1-9][0-9]{0,})', new PortfolioController().update);
    adminRouter.delete('/portfolio/delete/:portfolio_id([1-9][0-9]{0,})', new PortfolioController().destroy);
    //--------------------admin categories------------------------------------------------------------------------------
    adminRouter.post('/category/create', new CategoriesController().create);
    adminRouter.post('/category/update/:category_id([1-9][0-9]{0,})', new CategoriesController().update);
    adminRouter.delete('/category/delete/:category_id([1-9][0-9]{0,})', new CategoriesController().destroy);
    // adminRouter.post('/notification', new UserController().notification);
    adminRouter.post('/admin-data', new AdminDataController().index);
}));

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.post('/login', async function (req, res, next) {
    let valid_err = api_validate({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required()
    }, req, res);
    if (valid_err) {
        return res.send({errors: valid_err});
    }

    const {email, password} = req.body;
    let errors = {};
    const user = await DB('users').where("email", email).first();
    if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
            errors['password'] = 'The password is incorrect.';
            return res.send({errors: errors});
        }
    } else {
        errors['email'] = 'The user with this email does not exists.';
        return res.send({errors: errors});
    }
    let token = await saveAndGetUserToken(user.id, 'admin');

    return res.send({user: user, token: token});
});

router.get('/logout', async (req, res, next) => {
    let logout = false;
    if (res.locals.$api_auth.admin) {
        logout = await apiLogoutUser(res.locals.$api_auth.admin.id, 'admin', req, res);
    }
    if (res.locals.$api_auth.user) {
        logout = await apiLogoutUser(res.locals.$api_auth.user.id, 'user', req, res);
    }
    if (logout) {
        return res.send({message: 'Logged out successfully.'});
    }
    res.status(422);
    return res.send({errors: 'Not logged out.'});
});

router.get('/products', async (req, res) => {

    return res.send({auth: res.locals.$api_auth, locale: res.locals.$api_local});
});
router.post('/upload-file', async (req, res) => {
    // let file = req.files ? req.files.avatar : null;
    let errors = await  new VRequest(req, res)
        .key('testFiles').array().max(3).arrayEach().file().mimes(['.png'])
        .key('testText').required().max(7)
        .key('old_password').requiredWith('new_password').min(6).max(30)
        .key('new_password').min(6).max(30)
        .validate();
    if(errors){
        res.status(422);
        return res.send({errors: errors});
    }
    console.log('req.body=', req.body);
    console.log('req.files=', req.files);
    // return res.send({is: 'ok'});

    return res.send({is: 'ok'});
});

module.exports = router;
