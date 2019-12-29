const express = require('express')
const countryRouter = express.Router()
const CountryService = require('../services/country-service')

countryRouter
  .route('/')
  .get(getAllCountries)

function getAllCountries(req, res, next) {
  const knexI = req.app.get('db')
  CountryService
    .getAllCountries(knexI)
    .then(countries => {

      res.json(countries)
    })
}


module.exports = countryRouter
