const UserService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('user')
  },

  postUser(knex, postBody) {
    return knex
      .insert(postBody)
      .into('user')
      .returning('*')
      .then(rows => rows[0])
  },

  upsertUser(accessToken, refreshToken, profile) {
    console.log('ACCESSTOKEN', accessToken)
    console.log('PROFILE', profile)
    console.log('validate userExists in authRouter..')
    console.log('save stuff to db here')


    // var that = this;
    // return this.findOne({
    //   'facebookProvider.id': profile.id
    // }, function (err, user) {
    //   // no user was found, lets create a new one
    //   if (!user) {
    //     var newUser = new that({
    //       fullName: profile.displayName,
    //       email: profile.emails[0].value,
    //       facebookProvider: {
    //         id: profile.id,
    //         token: accessToken
    //       }
    //     });

    //     newUser.save(function (error, savedUser) {
    //       if (error) {
    //         console.log(error);
    //       }
    //       return cb(error, savedUser);
    //     });
    //   } else {
    //     return cb(err, user);
    //   }
    // });
  },

}

module.exports = UserService;
