var express = require('express');
var authRouter = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
//var config = require('../config');
//var request = require('request');
require('../passport')();

//passport.use(new FacebookTokenStrategy({ ..saves data from req in db
authRouter.route('/auth/facebook')
  .post(
    passport.authenticate('facebook-token', { session: false }),
    isAuthorized,
    generateToken,
    sendToken
  );


function isAuthorized(req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id
  };

  next();
}

module.exports = authRouter;
