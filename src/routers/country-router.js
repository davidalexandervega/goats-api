const express = require('express')
const countryRouter = express.Router()
const logger = require('../utils/logger.utils')
const CountryService = require('../services/country-service')

countryRouter
  .route('/')
  .get(getAllCountries)

countryRouter
  .route('/:code')
  .all(checkExists)
  .get(getCountry)

function checkExists(req, res, next) {
  const knexI = req.app.get('db')
  const { code } = req.params
  CountryService
    .getByCode(knexI, code)
    .then(country => {
      if (!country) {
        logger.error(`country does not exist`)
        return res.status(404).json({ message: `country does not exist` })
      }
      res.country = country
      next()
    })
    .catch(next)
}

function getCountry(req, res, next) {
  res.json(res.country)
}

function getAllCountries(req, res, next) {
  const knexI = req.app.get('db')
  CountryService
    .getAllCountries(knexI)
    .then(countries => {
      res.json(countries)
    })
}


module.exports = countryRouter
