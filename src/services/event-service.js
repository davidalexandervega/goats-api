const EventService = {
  selectAllEvents(knex) {
    return knex
      .select('*')
      .from('event')
  },

  selectFlyerEvents(knex, flyerId) {
    return knex
      .select('*')
      .from(event)
      .where('flyer_id', flyerId)
  },

  selectEventRegions(knex) {
    return knex
      .select('country_name', 'region_name')
      .count('region_name as per_region')
      .from('event')
      .whereNot('country_name', null)
      .andWhereNot('region_name', null)
      .groupBy('country_name', 'region_name')
      .orderBy('country_name', 'region_name')

  },

  selectEventCountries(knex) {
    return knex
      .select('country_name')
      .count('country_name as per_country')
      .from('event')
      .whereNot('country_name', null)
      .groupBy('country_name')
      .orderBy('country_name')
  },

  insertEvent(knex, postBody) {
    return knex
      .insert(postBody)
      .into('event')
      .returning('*')
      .then(rows => rows[0])
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('event')
      .where('id', id)
      .first()
  },

  deleteEvent(knex, id) {
    return knex
      .where('id', id)
      .from('event')
      .delete()
  }

}

module.exports = EventService;
