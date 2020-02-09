const express = require('express')
const flyerRouter = express.Router()
const FlyerService = require('../services/flyer-service')
const FlyerUtils = require('../utils/flyer.utils')
const logger = require('../utils/logger.utils')

flyerRouter
  .route('/')
  .get(getAllFlyers)

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


module.exports = flyerRouter
