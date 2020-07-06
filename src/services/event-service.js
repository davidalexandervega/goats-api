const EventService = {
  selectAllEvents(knex) {
    return knex
      .select('*')
      .from('event')
  },

  selectFlyerEvents(knex, flyerId) {
    return knex
      .select('*')
      .from('event')
      .where('flyer_id', flyerId)
  },

  selectEventsByUserId(knex, userId) {
    return knex
      .select('event.*')
      .from('event')
      .join('flyer', 'event.flyer_id', '=', 'flyer.id')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned'])
      .where('app_user.id', userId)
  },

  selectEventRegions(knex) {
    return knex
      .join('flyer', 'event.flyer_id', '=', 'flyer.id')
      .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      .select('event.country_name', 'event.region_name')
      .count('event.region_name as per_region')
      .from('event')
      .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
      .andWhereNot('event.country_name', null)
      .andWhereNot('event.country_name', '')
      .andWhereNot('event.region_name', null)
      .andWhereNot('event.region_name', '')
      .groupBy('event.country_name', 'event.region_name')
      .orderBy('event.country_name', 'event.region_name')
  },

  selectEventCountries(knex) {
    return knex
      .raw(`
        SELECT
          e.country_name AS country_name,
          COUNT(e.country_name) AS per_country,
          SUM(CASE WHEN e.event_date > CURRENT_TIMESTAMP THEN 1 ELSE 0 END) AS upcoming_per_country
        FROM
          event e
          INNER JOIN
            flyer f
          ON
            e.flyer_id = f.id
          INNER JOIN
            app_user a
          ON
            f.creator_id = a.id
        WHERE
          (e.country_name != '' OR  e.country_name != null)
        AND
          (a.user_state != 'Private' AND a.user_state != 'Archived' AND a.user_state !='Banned')
        GROUP BY
          e.country_name
        ORDER BY
          e.country_name
      `)
       .then(rows => {
         return rows.rows
       })
    // AND f.listing_state NOT IN('Archived', 'Banned', 'Draft')
    // AND a.user_state NOT IN('Archived', 'Banned', 'Private')
      // .join('flyer', 'event.flyer_id', '=', 'flyer.id')
      // .join('app_user', 'flyer.creator_id', '=', 'app_user.id')
      // .select('event.country_name')
      // .count('event.country_name as per_country')
      // //.count('event.country_name as upcoming_per_country', knex.raw(`andwhere event.event_date > CURRENT_TIMESTAMP()`))
      // //.count(knex.raw(`CASE WHEN event.event_date >= CURRENT_TIMESTAMP event.country_name as upcoming_per_country `))
      // .from('event')
      // .whereNotIn('flyer.listing_state', ['Archived', 'Banned', 'Draft'])
      // .whereNotIn('app_user.user_state', ['Archived', 'Banned', 'Private'])
      // .whereNot('event.country_name', null)
      // .andWhereNot('event.country_name', '')
      // .groupBy('event.country_name')
      // .orderBy('event.country_name')
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
  },

  replaceEventsForFlyer(knex, id, newEvents) {
    return knex
    .where('flyer_id', id)
    .from('event')
    .delete()
    .then(() => {
      return knex
        .insert(newEvents)
        .into('event')
        .returning('*')
        .then(rows => rows)
    })
  }
}

module.exports = EventService;
