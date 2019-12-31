const express = require('express')
const path = require('path')
const logger = require('../utils/logger.utils')
const eventRouter = express.Router()
const EventService = require('../services/event-service')
const bodyParser = express.json()
const EventUtils = require('../utils/event.utils')
const authCreator = require('../mws/auth-creator')
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
  .post(
    bodyParser,
    authCreator.post,
    postEvent
  )


eventRouter
  .route('/:id')
  .all(checkExists)
  .get(getEvent)

eventRouter
  .route('/facebook')
  .post( postEventFromFacebook )


function checkExists(req, res, next) {
  const knexI = req.app.get('db')
  const { id } = req.params

  //let idNum = parseInt(id)
  EventService
    .getById(knexI, id)
    .then(event => {
      if (!event) {
        logger.error(`Event does not exist`)
        return res.status(404).json({message: `Event does not exist`})
      }
      res.event = event
      next()
    })
    .catch(next)

}

function getEvent(req, res, next) {
  logger.info(`Successful GET /event/${res.event.id}`)
  res.json(EventUtils.sanitize(res.event))
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

  for (const [key, value] of Object.entries(requiredFields)) {
    if(value == null || !value) {
      logger.error(`POST /event missing ${key}`)
      return res.status(400).json({ message: `${key} is required.`})
    }
  }
  const postBody = req.body

  EventService
    .insertEvent(knexI, postBody)
    .then(newEvent => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newEvent.id}`))
        .json(EventUtils.sanitize(newEvent))
    })
    .catch(next)

}


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




module.exports = eventRouter
