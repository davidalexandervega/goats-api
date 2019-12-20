const jwt = require('jsonwebtoken')
const { facebookAuth } = require('../../config/auth-config')

const createToken = function (auth) {

  return jwt.sign({
    id: auth.id
  },
  // `${facebookAuth.clientSecret}`,
  'my-secret',
  {
    expiresIn: 60 * 120
  });
};

function generateToken(req, res, next) {
  //req.token = req.user.facebook_provider_token
  req.token = createToken(req.auth);
  return next();
}

function sendToken(req, res) {
  res.setHeader('x-auth-token', req.token);
  //return res.status(200).json(req.user);
  res.status(200).send(JSON.stringify(req.user));
}

module.exports = {
  generateToken,
  sendToken
};
