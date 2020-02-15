const FlyerService = {
  selectAllFlyers(knex) {
    return knex
    .from('flyer')
    .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
    .select('flyer.*')
    .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
    .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
    .orderBy('flyer.modified', 'desc')
  },

  selectPaginatedFlyers(knex, limit, offset) {
    return knex
      .from('flyer')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .select(
        'flyer.*',
        'app_user.username as creator_username',
        'app_user.image_url as creator_image_url'
      )
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
      .orderBy('flyer.modified', 'desc')
      .limit(limit)
      .offset(offset)
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
