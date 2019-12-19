const express = require('express')
const UserService = require('./user-service')
const uuid = require('uuid/v1')
const bodyParser = express.json()
const xss = require('xss')
const sanitize = user => {
  return {
    id: user.id,
    fullname: xss(user.fullname),
    username: xss(user.username),
    city_id: user.city_id
    //password: xss(user.password),
    //email: xss(user.email),
    //type: user.type,
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
  }
}

const userRouter = express.Router()

userRouter
  .route('/')
  .get(getAllUsers)
  //.post(postUser)

// userRouter
//   .route('/:id')
  //.all(checkExists)

// function checkExists(req, res, next) {
//   const { id } = req.params
//   const db = req.app.get('db')

//   BookmarksService
//     .getById(db, id)
//     .then(bookmark => {
//       if (!bookmark) {
//         return res.status(404).json({ error: { message: `Bookmark doesn't exist` } })
//       }
//       res.bookmark = bookmark
//       next()
//     })
//     .catch(next)
// }

function getAllUsers(req, res, next) {
  const knexI = req.app.get('db')
  UserService
    .getAllEvents(knexI)
    .then(users => {
      const sanitized = events.map(user => sanitize(user))
      res.json(sanitized)
    })
    .catch(next)
}

// function postUser(req, res, next) {
//   const knexI = req.app.get('db')
// }




module.exports = userRouter
