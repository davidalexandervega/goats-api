'use strict';
const passport = require('passport');
const uuid = require('uuid/v1');
const { UserFB } = require('./user/user');
const UserService = require('./user/user-service');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('../config/auth-config');


module.exports = function () {

  passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    fbGraphVersion: 'v5.0',
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
      const knexI = req.app.get('db')

      let error; // use in case there is no error
      let user;  // use in case there is no user
      //console.log('PASSPRTS FB ACCESSTOKEN', accessToken)
      UserService
        .getByFBId(knexI, profile.id)
        .then(existingUser => {

          if (!existingUser) {
            //console.log('no user, making post')

            const postBody = new UserFB(
              uuid(),
              profile.displayName,
              profile.emails[0].value,
              profile.id,
              accessToken
            )

            return UserService.insertUser(knexI, postBody)
              .then(newUser => {
                if(!newUser) {
                  error = new Error('Trouble saving new user')
                  return done(error, user)
                }
                //console.log('returning new user', newUser)
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
                  //console.log('returning updated user', updatedUser.facebook_provider_id)
                  //console.log('with saved token', updatedUser.facebook_provider_token)
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
