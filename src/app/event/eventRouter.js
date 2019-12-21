const express = require('express')
//const request = require('request-promise')
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
const { facebookAuth } = require('../../config/auth-config')
const { Facebook, FacebookApiException } = require('fb')
const fb = new Facebook({
  version: 'v2.4',
  appId: facebookAuth.clientID,
  appSecret: facebookAuth.clientSecret
});


eventRouter
  .route('/')
  .get(getAllEvents)

eventRouter
  .route('/facebook')
  .post( postEventFromFacebook )

// function postEventFromFacebook(req, res, next) {
//   const { eventId, facebookProviderToken, facebookProviderId } = req.body

//   // you need permission for most of these fields
//   const eventFieldSet = 'id, name, description';

//   const options = {
//     method: 'GET',
//     uri: `https://graph.facebook.com/v5.0/${eventId}`,
//     //uri: `https://graph.facebook.com/v5.0/search`,
//     qs: {
//       access_token: facebookProviderToken,
//       fields: eventFieldSet,
//       type: 'event'
//     }
//   };

//   request(options)
//     .then(fbRes => {
//       if (!fbRes.ok) {
//         return fbRes.json().then(error => Promise.reject(error))
//       }
//       console.log(fbRes)
//       const parsedRes = JSON.parse(fbRes).data;
//       return res.json(parsedRes);
//     })
//     .catch(next)

// }

function postEventFromFacebook(req) {
  const { eventId, facebookProviderToken, facebookProviderId } = req.body
  //FB.options({version: 'v4.0'});
  console.log('POST EVENT FROM FACEBOOK BACKEND')
  console.log('USER ACCESS TOKEN getting passed to api', facebookProviderToken)
  fb.setAccessToken(facebookProviderToken);
  fb.api(`/${eventId}`, {  accessToken: facebookProviderToken }, function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }

    console.log(res);
    return
    // console.log(res.id);
    // console.log(res.name);
  });
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
