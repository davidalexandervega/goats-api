const express = require('express')
const countryRouter = express.Router()
const CountryService = require('./country-service')
const bodyParser = express.json()
const xss = require('xss')
// const sanitize = event => {
//   return {
//     id: event.id,
//     fb_place_id: event.fb_place_id,
//     fb_cover_photo_id: event.fb_cover_photo_id,
//     event_times: event.event_times,
//     event_name: xss(event.event_name),
//     description: xss(event.description),
//     updated_time: event.updated_time
//   }
// }

countryRouter
  .route('/')
  .get(getAllCountries)

function getAllCountries(req, res, next) {
  const knexI = req.app.get('db')
  CountryService
    .getAllCountries(knexI)
    .then(countries => {
      const sanitized = countries.map(country => sanitize(country))
      res.json(sanitized)
    })
}


module.exports = countryRouter
