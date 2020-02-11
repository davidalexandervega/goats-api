const express = require('express')
const flyerRouter = express.Router()
const FlyerService = require('../services/flyer-service')
const EventService = require('../services/event-service')
const FlyerUtils = require('../utils/flyer.utils')
const EventUtils = require('../utils/event.utils')
const logger = require('../utils/logger.utils')
const authUser = require('../mws/auth-user')
const bodyParser = express.json()
const path = require('path')
const { check, validationResult, body, sanitizeBody, sanitizeParam } = require('express-validator')

// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

flyerRouter
  .route('/')
  .get(authUser.get, getAllFlyers)
  .post(
    bodyParser,
    authUser.post,
    [
      check('creator_id')
        .not().isEmpty().withMessage('creator is required.'),
      check('headline')
        .not().isEmpty().withMessage('headline is required.')
        .isLength({ min: 0, max: 180 }).withMessage(`headline character limit is 180`),
      check('image_url')
        .not().isEmpty().withMessage('image_url is required.')
        .isURL().withMessage('Must be valid source url.'),
      check('flyer_type')
        .not().isEmpty().withMessage('flyer_type is required.'),
      sanitizeBody('events').customSanitizer(value => {
        if (!value) {
          return []
        }
        return value
      }),
      check('events')
        .isArray().withMessage('events must be an array.'),
      sanitizeBody('listing_state').customSanitizer(value => {
        if (value && value.length > 0) {
          let val = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
          return val.trim()
        }
        return 'Public'; //default on post only
      }),
      check('listing_state')
        .isIn(['Draft', 'Private', 'Public', 'Archived'])
        .withMessage('Unauthorized listing control.'),
      //tests written up to here
      check('flyer_type')
        .isIn(['Show', 'Fest', 'Tour'])
        .withMessage('flyer_type must be one of Show, Fest, or Tour.'),
      check('bands')
        .isLength({ min: 0, max: 666 })
        .withMessage(`bands character limit is 666`),
      check('details')
        .isLength({ min: 0, max: 666 })
        .withMessage(`details character limit is 666`),
      check('publish_comment')
        .isLength({ min: 0, max: 666 })
        .withMessage(`publish comment character limit is 666`)

    ],
    postFlyer
  )

flyerRouter
  .route('/:id')
  .all(checkExists)
  .get(getFlyer)
  .delete(
    authUser.deleteFlyer,
    deleteFlyer
  )

function checkExists(req, res, next) {
  const knexI = req.app.get('db')
  const { id } = req.params

  FlyerService
    .getById(knexI, id)
    .then(flyer => {
      if (!flyer) {
        logger.error(`Flyer does not exist`)
        return res.status(404).json({ message: `Flyer does not exist` })
      }
      res.flyer = flyer
      next()
    })
    .catch(next)

}

function getFlyer(req, res, next) {
  res.json(FlyerUtils.sanitize(res.flyer))
}

function getAllFlyers(req, res, next) {
  const knexI = req.app.get('db')
  FlyerService
    .selectAllFlyers(knexI)
    .then(flyers => {
      const sanitized = flyers.map(flyer => FlyerUtils.sanitize(flyer))
      res.json(sanitized)
    })
    .catch(next)
}

function postFlyer(req, res, next) {
  const validErrors = validationResult(req)
  if (!validErrors.isEmpty()) {
    logger.error(`1 of ${validErrors.errors.length} ${validErrors.errors[0].msg}`)
    return res.status(400).json({ message: validErrors.errors[0].msg })
  }

  const knexI = req.app.get('db')
  const { events, ...flyer } = req.body
  // validate flyer body with library, validate events array

  FlyerService
    .insertFlyer(knexI, flyer)
    .then(async flyerRes => {
      let eventsRes = []

      const eventsWithFlyerId = events.map(event => {
        return { flyer_id: flyerRes.id, ...event }
      })

      let newFlyerWithEventsRes = await asyncForEach(eventsWithFlyerId, async (event) => {
        await EventService
          .insertEvent(knexI, event)
          .then(eventRes => {
            return eventsRes.push(eventRes)
          })
          .catch(next)
      })

      newFlyerWithEventsRes = {
        ...FlyerUtils.sanitize(flyerRes),
        events: eventsRes.map(event => EventUtils.sanitize(event))
      }

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newFlyerWithEventsRes.id}`))
        .json(newFlyerWithEventsRes)
    })
    .catch(next)
}

function deleteFlyer(req, res, next) {
  const knexI = req.app.get('db')
  const id = res.flyer.id

  FlyerService
    .deleteFlyer(knexI, id)
    .then(numOfRowsAffected => {
      res.status(204).end()
    })
    .catch(next)

}

module.exports = flyerRouter
