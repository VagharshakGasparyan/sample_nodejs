const express = require('express');
const {validate, api_validate} = require("../components/validate");
const Joi = require("joi");
const {User} = require("../models");
const bcrypt = require("bcrypt");
const {saveAndGetUserToken, apiLogoutUser} = require("../components/functions");
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', async function(req, res, next) {
  console.log('req.body=', req.body);
  let valid_err = api_validate({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required()
  }, req, res);
  if(valid_err){
    return res.send({errors: valid_err});
  }

  const {email, password} = req.body;
  let errors = {};
  const user = await User.findOne({where: {email: email}});
  if(user){
    if(!bcrypt.compareSync(password, user.dataValues.password)){
      errors['password'] = 'The password is incorrect.';
      return res.send({errors: errors});
    }
  }else{
    errors['email'] = 'The user with this email does not exists.';
    return res.send({errors: errors});
  }
  let token = await saveAndGetUserToken(user.dataValues.id, 'admin');

  return res.send({user: user, token: token});
});

router.get('/logout', async (req, res, next)=>{
  let logout = false;
  if(res.locals.$api_auth.admin){
    logout = await apiLogoutUser(res.locals.$api_auth.admin.dataValues.id, 'admin', req, res);
  }
  if(res.locals.$api_auth.user){
    logout = await apiLogoutUser(res.locals.$api_auth.user.dataValues.id, 'user', req, res);
  }
  if(logout){
    return res.send({message: 'Logged out successfully.'});
  }
  res.status(422);
  return res.send({errors: 'Not logged out.'});
});

router.get('/products', async (req, res) => {

  return res.send(res.locals.$api_auth);
});


module.exports = router;
