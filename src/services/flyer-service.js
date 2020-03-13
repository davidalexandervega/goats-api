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

  selectByRegion(knex, limit, offset, region) {
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

      .join('event', 'flyer.id', '=', 'event.flyer_id')
      .whereNotNull('event.region_name')
      .andWhere('event.region_name', '!=', '')
      .andWhere('event.region_name', '=', region)
      .distinct('flyer.id')

      .orderBy('flyer.modified', 'desc')
      .limit(limit)
      .offset(offset)
  },

  getTotalByRegion(knex, region) {
    return knex
      .count('flyer.id')

      .from('flyer')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])

      .join('event', 'flyer.id', '=', 'event.flyer_id')
      .whereNotNull('event.region_name')
      .andWhere('event.region_name', '!=', '')
      .andWhere('event.region_name', '=', region)
  },

  selectByCountry(knex, limit, offset, country) {
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

      .join('event', 'flyer.id', '=', 'event.flyer_id')
      .whereNotNull('event.country_name')
      .andWhere('event.country_name', '!=', '')
      .andWhere('event.country_name', '=', country)
      .distinct('flyer.id')

      .orderBy('flyer.modified', 'desc')
      .limit(limit)
      .offset(offset)
  },

  selectUserFlyers(knex, creatorId) {
    return knex
      .select(
        'flyer.*',
        'app_user.username as creator_username',
        'app_user.image_url as creator_image_url'
      )
      .from('flyer')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .where('flyer.creator_id', creatorId)
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned'])
      .orderBy('flyer.modified', 'desc')
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

  updateFlyer(knex, id, patchBody) {
    return knex('flyer')
      .where('id', id)
      .update(patchBody)
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
      //.whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft']) //remove for tests
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
