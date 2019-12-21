const UserService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('app_user')
  },

  insertUser(knex, postBody) {
    return knex
      .insert(postBody)
      .into('app_user')
      .returning('*')
      .then(rows => rows[0])
  },

  getByFBId(knex, fbId) {
    return knex
      .select('*')
      .from('app_user')
      .where('facebook_provider_id', fbId)
      .first()
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('app_user')
      .where('id', id)
      .first()
  },

  getByUsername(knex, username) {
    return knex
      .select('*')
      .from('app_user')
      .where('username', 'ilike', username)
      .first()
  },

  updateUser(knex, id, patchBody) {
    return knex
      .where('id', id)
      .from('app_user')
      .update(patchBody)
  },

}

module.exports = UserService;
