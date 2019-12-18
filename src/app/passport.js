'use strict';

//require('./mongoose')();
const passport = require('passport');
const uuid = require('uuid/v1');
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

      let error; // use in case there is no error
      let user;  // use in case there is no user

      UserService
        .getByFBId(knexI, profile.id)
        .then(existingUser => {
          if (!existingUser) {

            const postBody = {
              id: uuid(),
              fullname: profile.displayName,
              email: profile.emails[0].value,
              facebook_provider_id: profile.id,
              facebook_provider_token: accessToken
            }

            UserService.postUser(knexI, postBody)
              .then(newUser => {
                if(!newUser) {
                  error = new Error('Trouble saving new user')
                  return done(error, user)
                }
                return done(error, newUser)
              })

          }
          return done(error, existingUser)
        })
        .catch(err => {
          console.log('ERR ON PASSPORT', err)
          error = err;
          return done(error, user)
        })

  }));

};
