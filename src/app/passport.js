'use strict';

//require('./mongoose')();
var passport = require('passport');
//var User = require('mongoose').model('User');
//const userRouter = require('./user/userRouter');
const UserService = require('./user/user-service');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('../config/auth-config');


module.exports = function () {

  passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret
  },
  function (accessToken, refreshToken, profile, done) {
      // User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
      //   return done(err, user);
      // });
      // const user = profile;
      if (!profile) {
        let err = new Error({error: {message: 'no profile'}})
      }
      const postBody = {
        fullName: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider_id: profile.id,
        facebookProvider_token: profile.accessToken
      }
      return done(err, postBody)
      // or how would I use...
      // app.use('/api/user', userRouter)
      //UserService.postUser(knexI, postBody)
  }));

};
