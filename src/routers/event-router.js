const express = require('express')
const path = require('path')
const eventRouter = express.Router()
const EventService = require('../services/event-service')
const logger = require('../utils/logger.utils')
const EventUtils = require('../utils/event.utils')
const authUser = require('../mws/auth-user')


eventRouter
  .route('/')
  .get(authUser.get, getAllEvents)

eventRouter
  .route('/:id')
  .all(checkExists)
  .get(authUser.get, getEvent)


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




module.exports = eventRouter
