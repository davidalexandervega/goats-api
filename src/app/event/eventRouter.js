const express = require('express')
const request = require('request-promise')
const eventRouter = express.Router()
const EventService = require('./event-service')
const bodyParser = express.json()
const xss = require('xss')
const sanitize = event => {
  return {
    id: event.id,
    fb_place_id: event.fb_place_id,
    fb_cover_photo_id: event.fb_cover_photo_id,
    event_times: event.event_times,
    event_name: xss(event.event_name),
    description: xss(event.description),
    updated_time: event.updated_time
  }
}
// const passport = require('passport');
// require('../passport')();

eventRouter
  .route('/')
  .get(getAllEvents)

eventRouter
  .route('/facebook')
  .post(
    bodyParser,
    postEventFromFacebook
  )

function postEventFromFacebook(req, res, next) {
  const { eventId, facebookProviderToken, facebookProviderId } = req.body

  // you need permission for most of these fields
  // const eventFieldSet = 'id, name, description';

  const options = {
    method: 'GET',
    //uri: `https://graph.facebook.com/v5/${eventId}`,
    uri: `https://graph.facebook.com/v5/search`,
    qs: {
      access_token: facebookProviderToken,
      q: 'Fiat',
      fields: 'name, category, link, picture, is_verified',
      type: 'page'
    }
  };

  request(options)
    .then(fbRes => {
      if (!fbRes.ok) {
        return fbRes.json().then(error => Promise.reject(error))
      }
      console.log(fbRes)
      const parsedRes = JSON.parse(fbRes).data;
      return res.json(parsedRes);
    })
    .catch(next)


}

function getAllEvents(req, res, next) {
  const knexI = req.app.get('db')
  EventService
    .getAllEvents(knexI)
    .then(events => {
      const sanitized = events.map(event => sanitize(event))
      res.json(sanitized)
    })
    .catch(next)
}




module.exports = eventRouter
