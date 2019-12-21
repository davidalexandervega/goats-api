const express = require('express')
const path = require('path')
const UserService = require('../services/user-service')
const { UserCustom } = require('../models/user')
const uuid = require('uuid/v1')
const bodyParser = express.json()
const xss = require('xss')
const sanitize = user => {
  return {
    id: user.id,
    username: xss(user.username),
    city_id: user.city_id,
    //fullname: xss(user.fullname),
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
  .post(bodyParser, postUser)

userRouter
  .route('/:id')
  .all(checkExists)
  .get(getById)

// userRouter
//   .route('/:username')
//   .all(checkUsernameExists)
//   .get(getByUsername)

function checkExists(req, res, next) {
  const { id } = req.params
  const db = req.app.get('db')

  UserService
    .getById(db, id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: { message: `User doesn't exist` } })
      }
      res.user = user
      next()
    })
    .catch(next)
}

// function checkUsernameExists(req, res, next) {
//   const { username } = req.params
//   const db = req.app.get('db')

//   UserService
//     .getByUsername(db, username)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ error: { message: `Username doesn't exist` } })
//       }
//       res.user = user
//       next()
//     })
//     .catch(next)
// }

// function getByUsername(req, res, next) {
//   res.json(sanitize(res.user))
// }

function getAllUsers(req, res, next) {
  const knexI = req.app.get('db')
  UserService
    .getAllUsers(knexI)
    .then(users => {
      const sanitized = users.map(user => sanitize(user))
      res.json(sanitized)
    })
    .catch(next)
}

function getById(req, res, next) {
  res.json(sanitize(res.user))
}

function postUser(req, res, next) {
  const knexI = req.app.get('db')
  const { username, password, email } = req.body
  const requiredFields = { username, password, email }

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({ error: { message: `${key} required in post body` } })
    }
  }


  const regex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  if (!regex.test(email)) {
    //logger.error(`${url} is not a valid url`)
    return res.status(400).json({ error: { message: 'url is invalid' } })
  }


  const postBody = new UserCustom(
    username,
    email,
    password
  )



  UserService
    .insertUser(knexI, postBody)
    .then(user => {
      res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json(sanitize(user))
    })
    .catch(next)
}




module.exports = userRouter
