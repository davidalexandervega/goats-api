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

flyerRouter
  .route('/')
  .get(authUser.get, getAllFlyers)
  .post(bodyParser, authUser.post, postFlyer)

flyerRouter
  .route('/:id')
  .all(checkExists)
  .get(getFlyer)

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
  //logger.info(`Successful GET /flyer/${res.flyer.id}`)
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

      // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

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


module.exports = flyerRouter
