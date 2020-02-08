const FlyerService = {
  selectAllFlyers(knex) {
    return knex
      .select('*')
      .from('flyer')
      .whereNotIn('listing_state', ['Archived', 'Banned', 'Draft'])
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
  }

}

module.exports = FlyerService;
