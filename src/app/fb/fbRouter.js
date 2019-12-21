const express = require('express');
var passport = require('passport');
const fbRouter = express.Router();
const { generateToken, sendToken } = require('../utils/token.utils');
require('./passport')();

//passport.use(new FacebookTokenStrategy({ ..saves data from req in db
fbRouter.route('/auth/facebook')
  .post(
    passport.authenticate('facebook-token', { session: false }),
    isAuthorized,
    sendFBToken
    //generateToken,
    //sendToken
  );


function isAuthorized(req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  console.log('is authorize function req user', req.user)
  req.auth = {
    id: req.user.facebook_provider_id
    //id: req.user.id
  };
  next();
}

function sendFBToken(req, res) {

  res.setHeader('x-auth-token', req.auth.id);
  //return res.status(200).json(req.user);
  return res.status(200).send(JSON.stringify(req.user));
}

module.exports = fbRouter;
