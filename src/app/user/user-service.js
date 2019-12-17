const UserService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('app_user')
  },

  postUser(knex, postBody) {
    return knex
      .insert(postBody)
      .into('app_user')
      .returning('*')
      .then(rows => rows[0])
  },

  getByFBId(knex, id) {
    return knex
      .select('*')
      .from('app_user')
      .where('facebookProvider_id', id)
      .first()
  },

}

module.exports = UserService;
