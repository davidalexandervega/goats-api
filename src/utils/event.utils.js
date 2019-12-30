const xss = require('xss')

const sanitize = event => {
  return {
    id: event.id,
    creator_id: event.creator_id,
    venue_id: event.venue_id,
    image_url: xss(event.image_url),
    event_times: xss(event.event_times),
    title: xss(event.title),
    description: xss(event.description),
    start_date: event.start_date,
    end_date: event.end_date,
    created: event.created,
    modified: event.modified
    // listing_state: event.listing_state
  }
}

const sanitizeAdmin = event => {
  return {
    id: event.id,
    creator_id: event.creator_id,
    venue_id: event.venue_id,
    image_url: xss(event.image_url),
    event_times: xss(event.event_times),
    title: xss(event.title),
    description: xss(event.description),
    start_date: event.start_date,
    end_date: event.end_date,
    created: event.created,
    modified: event.modified,
    listing_state: event.listing_state
  }
}

module.exports = {
  sanitize, sanitizeAdmin
}
