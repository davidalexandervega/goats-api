const FlyerService = {
  selectAllFlyers(knex) {
    return knex
    .from('flyer')
    .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
    .select('flyer.*')
    .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
    .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
  },

  insertFlyer(knex, postBody) {
    return knex
      .insert(postBody)
      .into('flyer')
      .returning('*')
      .then(rows => rows[0])
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('flyer')
      .where('id', id)
      .first()
  },

  deleteFlyer(knex, id) {
    return knex
      .where('id', id)
      .from('flyer')
      .delete()
  }

}

module.exports = FlyerService;
