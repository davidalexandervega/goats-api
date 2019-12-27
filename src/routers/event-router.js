const express = require('express')
//const request = require('request-promise')
const eventRouter = express.Router()
const EventService = require('../services/event-service')
const bodyParser = express.json()
const logger = require('../utils/logger.utils')
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
const { facebookAuth } = require('../config/auth-config')
const { Facebook } = require('fb')
const fb = new Facebook({
  version: 'v2.4',
  appId: facebookAuth.clientID,
  appSecret: facebookAuth.clientSecret
});


eventRouter
  .route('/')
  .get(getAllEvents)

eventRouter
  .route('/facebook')
  .post( postEventFromFacebook )


function postEventFromFacebook(req) {
  const { eventId, facebookProviderToken, facebookProviderId } = req.body

  fb.options({ accessToken: facebookProviderToken })
  fb.api(`/v3.2/${facebookProviderId}/events`, function (res) {
  //fb.api(`/${facebookProviderId}/permissions`, function (res) {
    if (!res || res.error) {
      //console.log(!res ? 'error occurred' : res.error);
      logger.error(`Error within fb api cb ${!res ? 'error occurred' : res.error}`)
      return;
    }

    logger.error(`Fb api cb res ${JSON.stringify(res)}`)
    return
  });
}


function getAllEvents(req, res, next) {
  const knexI = req.app.get('db')
  EventService
    .getAllEvents(knexI)
    .then(events => {
      logger.info(`Successful GET /event`)
      const sanitized = events.map(event => sanitize(event))
      res.json(sanitized)
    })
    .catch(next)
}




module.exports = eventRouter
