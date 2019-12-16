const express = require('express')
const eventRouter = express.Router()
const EventService = require('./event-service')
const bodyParser = express.json()
const xss = require('xss')
const sanitize = event => {
  return {
    id: event.id,
    fb_place_id: event.fb_place_id,
    fb_cover_photo_id: event.fb_cover_photo_id,
    event_times: event.event_times,
    event_name: xss(event.event_name),
    description: xss(event.description),
    updated_time: event.updated_time
  }
}

eventRouter
  .route('/')
  .get(getAllEvents)

function getAllEvents(req, res, next) {
  const knexI = req.app.get('db')
  EventService
    .getAllEvents(knexI)
    .then(events => {
      const sanitized = events.map(event => sanitize(event))
      res.json(sanitized)
    })
}


module.exports = eventRouter
