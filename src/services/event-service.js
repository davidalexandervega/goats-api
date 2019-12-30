const EventService = {
  getAllEvents(knex) {
    return knex
      .select('*')
      .from('event')
  },

}

module.exports = EventService;
