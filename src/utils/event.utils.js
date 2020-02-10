const xss = require('xss')

const sanitize = event => {
  return {
    id: event.id,
    flyer_id: event.flyer_id,
    event_date: event.event_date,
    venue_name: xss(event.venue_name),
    city_name: xss(event.city_name),
    region_name: xss(event.region_name),
    country_name: xss(event.country_name),
    city_id: event.city_id
  }
}

module.exports = {
  sanitize
}
