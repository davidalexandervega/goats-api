const express = require('express')
const path = require('path')
const eventRouter = express.Router()
const EventService = require('../services/event-service')
const bodyParser = express.json()
const { check, validationResult, body, sanitizeBody, sanitizeParam } = require('express-validator');
const logger = require('../utils/logger.utils')
const EventUtils = require('../utils/event.utils')
const authUser = require('../mws/auth-user')
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
    authUser.post,
    [
      check('creator_id')
        .not().isEmpty().withMessage('creator is required.'),
      check('title')
        .not().isEmpty().withMessage('title is required.')
        .isLength({ min: 0, max: 66 }).withMessage(`title character limit is 66`),
      check('image_url')
        .not().isEmpty().withMessage('image_url is required.')
        .isURL().withMessage('Must be valid source url.'),
      check('description')
        .isLength({ min: 0, max: 666 })
        .withMessage(`description character limit is 666`),
      check('event_times')
        .isLength({ min: 0, max: 66 })
        .withMessage(`event_times character limit is 66`),
      sanitizeBody('created')
        .toDate(),
      sanitizeBody('modified')
        .toDate(),
      sanitizeBody('listing_state').customSanitizer(value => {
        if (value && value.length > 0) {
          let val = value.charAt(0).toUpperCase() + value.slice(1)
          return val.trim()
        }
        return 'Public'; //default on post only
      }),
      check('listing_state')
        .isIn(['Draft', 'Private', 'Public', 'Archived'])
        .withMessage('Unauthorized listing control.'),
      sanitizeBody('start_date')
        .toDate(),
      check('start_date')
        .custom(value => {
          if (value && check(value).isAfter()) {
            return Promise.reject('Date cannot be past.')
          }
          return true
        }),
      sanitizeBody('end_date')
        .toDate(),
      check('end_date')
        .custom(value => {
          if (value && check(value).isAfter()) {
            return Promise.reject('Date cannot be past.')
          }
          return true
        })
      // venue_id,
      // check('venue_id').isInt.withMessage('Referenced Venue must be integer')
      // check('venue_id').custom(value => {
      //   return VenueService.findById(value).then(venue => {
      //     if (!venue) {

      //       return Promise.reject('Could not find requested venue id.');
      //     }
      //   });
    ],
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
  const validErrors = validationResult(req)
  if (!validErrors.isEmpty()) {
    return res.status(400).json({ message: validErrors.errors[0].msg })
  }
  const knexI = req.app.get('db')


  // for (const [key, value] of Object.entries(requiredFields)) {
  //   if(value == null || !value) {
  //     logger.error(`POST /event missing ${key}`)
  //     return res.status(400).json({ message: `${key} is required.`})
  //   }
  // }
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
