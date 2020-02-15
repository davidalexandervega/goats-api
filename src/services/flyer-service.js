const FlyerService = {
  selectAllFlyers(knex) {
    return knex
    .select('flyer.*')
    .from('flyer')
    .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
    .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
    .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
    .orderBy('flyer.modified', 'desc')
  },

  selectPaginatedFlyers(knex, limit, offset) {
    return knex
      .select(
        'flyer.*',
        'app_user.username as creator_username',
        'app_user.image_url as creator_image_url'
      )
      .from('flyer')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
      .orderBy('flyer.modified', 'desc')
      .limit(limit)
      .offset(offset)
  },

  getTotal(knex) {
    return knex
      .count('flyer.id')
      .from('flyer')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
  },

  insertFlyer(knex, postBody) {
    return knex
      .insert(postBody)
      .into('flyer')
      .returning('*')
      .then(rows => {
        const flyer = rows[0]
        return knex
        .select(
          'flyer.*',
          'app_user.username as creator_username',
          'app_user.image_url as creator_image_url'
          )
          .from('flyer')
          .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
          .where('flyer.id', flyer.id)
          .first()
      })
  },

  getById(knex, id) {
    return knex
      .select(
        'flyer.*',
        'app_user.username as creator_username',
        'app_user.image_url as creator_image_url'
      )
      .from('flyer')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .where('flyer.id', id)
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
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
