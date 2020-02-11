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
