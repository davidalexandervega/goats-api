const express = require('express')
const flyerRouter = express.Router()
const FlyerService = require('../services/flyer-service')

flyerRouter
  .route('/')
  .get(getAllFlyers)



function getAllFlyers(req, res, next) {
  const knexI = req.app.get('db')
  FlyerService
    .selectAllFlyers(knexI)
    .then(flyers => {
      res.json(flyers)
    })
    .catch(next)
}


module.exports = flyerRouter
