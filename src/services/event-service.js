const EventService = {
  selectAllEvents(knex) {
    return knex
      .select('*')
      .from('event')
  },

  insertEvent(knex, postBody) {
    return knex
      .insert(postBody)
      .into('event')
      .returning('*')
      .then(rows => rows[0])
  },

}

module.exports = EventService;
