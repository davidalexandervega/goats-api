'use strict';
const passport = require('passport');
const { UserFB } = require('../models/user');
const UserService = require('../services/user-service');
const FacebookTokenStrategy = require('passport-facebook-token');
const {facebookAuth} = require('../config/auth-config');


module.exports = function () {

  passport.use(new FacebookTokenStrategy({
    clientID: facebookAuth.clientID,
    clientSecret: facebookAuth.clientSecret,
    fbGraphVersion: 'v5.0',
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
      const knexI = req.app.get('db')

      let error; // use in case there is no error
      let user;  // use in case there is no user

      UserService
        .getByFBId(knexI, profile.id)
        .then(existingUser => {

          if (!existingUser) {

            const newUser = new UserFB({
              fullname: profile.displayName,
              email: profile.emails[0].value,
              facebook_provider_id: profile.id,
              facebook_provider_token: accessToken
            })

            return UserService.insertUser(knexI, newUser)
              .then(newUser => {
                if(!newUser) {
                  error = new Error('Trouble saving new user')
                  return done(error, user)
                }
                return done(error, newUser)
              })

          }
          const patchBody = { facebook_provider_token: accessToken }
          UserService.updateUser(knexI, existingUser.id, patchBody)
            .then(() => {
              UserService.getById(knexI, existingUser.id)
                .then(updatedUser => {
                  if (!updatedUser) {
                    error = new Error('Trouble updating user')
                    return done(error, user)
                  }
                  return done(error, updatedUser)
                })
            })
            .catch(err => {
              console.log('ERR ON PASSPORT', err)
              error = err;
              return done(error, user)
            })
          // return done(error, existingUser)
        })
        .catch(err => {
          console.log('ERR ON PASSPORT', err)
          error = err;
          return done(error, user)
        })

  }));

};
