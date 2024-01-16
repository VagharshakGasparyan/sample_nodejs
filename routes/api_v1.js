const express = require('express');
const {validate, api_validate} = require("../components/validate");
const Joi = require("joi");
const {User} = require("../models");
const bcrypt = require("bcrypt");
const {loginUser} = require("../components/functions");
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
    return res.send(JSON.stringify({errors: valid_err}));
  }

  const {email, password} = req.body;
  let errors = {};
  const user = await User.findOne({where: {email: email}});
  if(user){
    if(!bcrypt.compareSync(password, user.dataValues.password)){
      errors['password'] = 'The password is incorrect.';
      return res.send(JSON.stringify({errors: errors}));
    }
  }else{
    errors['email'] = 'The user with this email does not exists.';
    return res.send(JSON.stringify({errors: errors}));
  }
  await loginUser(user.dataValues.id, req, res, 'user');
  await loginUser(user.dataValues.id, req, res, 'admin');

  return res.send({user: user});
});

router.get('/products', async (req, res) => {
  return res.send(res.locals.$auth);
});


module.exports = router;
