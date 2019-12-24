const express = require('express');
var passport = require('passport');
const authFbRouter = express.Router();
//const { generateToken, sendToken } = require('../utils/token.utils');
require('../mws/passport-auth-fb')();
const bodyParser = express.json()

authFbRouter.route('/auth/facebook')
  .post(
    bodyParser,
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
  };
  next();
}

function sendFBToken(req, res) {

  res.setHeader('x-auth-token', req.auth.id);
  return res.status(200).send(JSON.stringify(req.user));
}

module.exports = authFbRouter;
