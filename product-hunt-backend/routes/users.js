var express = require('express');
var router = express.Router();
let User = require("../Model/User");
let token = require("../modules/config");
let {compare} = require("bcrypt");
const nodemailer = require('../modules/nodemailer')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Need to change this endpoint


// registering user
router.post('/', async (req,res,next)=> {
  try {
    let user = await User.create(req.body.user);
    let createdToken = await token.generateJwt(user);
    // nodemailer(user)
    res.status(201).json({user:{... userInfo(user), createdToken}});
  } catch (error) {
    next(error);
  }
})

// login user
router.post("/login", async(req,res,next)=> {
  try {
    let {email, password} = req.body.user;
    let user =  await User.findOne({email});
    let result = await compare(password,user.password);
    if(user && result) {
      let createdToken = await token.generateJwt(user);
      // nodemailer(user)
      res.json({user:{... userInfo(user), createdToken}});
    }
  } catch (error) {
    next(error);
  }
})

function userInfo(user) {
  return {
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image
  }
}

module.exports = router;
