'use strict';

//require('./mongoose')();
const passport = require('passport');
const uuid = require('uuid');
//var User = require('mongoose').model('User');
//const userRouter = require('./user/userRouter');
const UserService = require('./user/user-service');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('../config/auth-config');


module.exports = function () {

  passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
      const knexI = req.app.get('db')
      // User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
      //   return done(err, user);
      // });
      // const user = profile;
      // if (!profile) {
        //   err = new Error({error: {message: 'no profile'}})
        // }

      let error;

      UserService
      .getByFBId(knexI, profile.id)

      // const postBody = {
      //   id: uuid()
      //   fullName: profile.displayName,
      //   email: profile.emails[0].value,
      //   facebookProvider_id: profile.id,
      //   facebookProvider_token: accessToken
      // }

      // UserService
      //   .post(knexI, postBody)
      //   .then(newUser => {
      //     if (!newUser.facebookProvider_id) {
      //       error = new Error('User already exists')s
      //       return done(error, newUser)
      //     }
      //     return error, newUser
      //   })
      //   .then((error, user) => {
      //     UserService
      //       .getByFBId(knexI, user.facebookProvider_id)
      //   })
      //   .catch(error => {
      //     return done(err, postBody)
      //   })
      // or how would I use...
      // app.use('/api/user', userRouter)
      //UserService.postUser(knexI, postBody)
  }));

};
