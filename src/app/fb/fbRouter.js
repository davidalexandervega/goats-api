const express = require('express');
const { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
//const config = require('../config');
//const request = require('request');
const fbRouter = express.Router();
require('../passport')();

//passport.use(new FacebookTokenStrategy({ ..saves data from req in db

fbRouter.route('/auth/facebook')
  .post(
    passport.authenticate('facebook-token', { session: false }),
    isAuthorized,
    generateToken,
    sendToken
  );

function isSaved(req, res, next) {
  const knexI = req.app.get('db')
  if( req.user) {
    console.log('USER EXISTS NEEDSS SAVING', req.user)

    next()
  }

  res.send(401, 'Errir in isSaved')
  //return res.send(401, 'User Not Authenticated');
}

function isAuthorized(req, res, next) {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id
  };

  next();
}

module.exports = fbRouter;
