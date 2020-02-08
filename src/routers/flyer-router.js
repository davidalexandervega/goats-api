const express = require('express')
const flyerRouter = express.Router()
const FlyerService = require('../services/flyer-service')
const FlyerUtils = require('../utils/flyer.utils')

flyerRouter
  .route('/')
  .get(getAllFlyers)


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
