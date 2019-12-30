const express = require('express')
const path = require('path')
const eventRouter = express.Router()
const EventService = require('../services/event-service')
const logger = require('../utils/logger.utils')
const bodyParser = express.json()
const EventUtils = require('../utils/event.utils')
const authenticateCreator = require('../mws/authenticate-creator')
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
  .post(bodyParser, authenticateCreator.post, postEvent)

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
    .selectAllEvents(knexI)
    .then(events => {
      logger.info(`Successful GET /event`)
      const sanitized = events.map(event => EventUtils.sanitize(event))
      res.json(sanitized)
    })
    .catch(next)
}

function postEvent(req, res, next) {
  const knexI = req.app.get('db')
  const {
    creator_id,
    venue_id,
    image_url,
    event_times,
    title,
    description,
    start_date,
    end_date,
    created,
    modified,
    listing_state
  } = req.body
  const requiredFields = { title, image_url, creator_id }
  const listingStateTypes = ['Draft', 'Private', 'Public', 'Flagged', 'Banned', 'Archived']

  const postBody = req.body

  EventService
    .insertEvent(knexI, postBody)
    .then(newEvent => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newEvent.id}`))
        .json(EventUtils.sanitize(newEvent))
    })

}





module.exports = eventRouter
