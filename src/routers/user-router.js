const express = require('express')
const path = require('path')
const UserService = require('../services/user-service')
const { UserCustom } = require('../models/user')
const { createToken, hashPassword, checkPassword } = require('../utils/token.utils')
const bodyParser = express.json()
const xss = require('xss')
const sanitize = user => {
  return {
    id: user.id,
    username: xss(user.username),
    city_id: user.city_id,
    //password: xss(user.password),
    //email: xss(user.email),
    //fullname: xss(user.fullname),
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
    //admin: user.admin,
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

userRouter
  .route('/signin')
  .post(bodyParser, signin)


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


function signin(req, res, next) {
  const knexI = req.app.get('db')
  const { username, password } = req.body
  const requiredFields = { username, password }

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({ error: { message: `${key} required for signin` } })
    }

  }
  let user;

  UserService
    .getByUsername(knexI, username)
    .then(foundUser => {
      if (!foundUser) {
        return res.status(404).json({ error: { message: `Username doesn't exist` } })
      }
      user = foundUser
      return checkPassword( password, foundUser)
    })
    .then(result => createToken())
    .then(token => {
      const patchBody = { token }
      return UserService
        .updateUser(knexI, user.id, patchBody)
        .catch(next)
    })
    .then(() => {
      delete user.password_digest
      res.json(sanitize(user))
    })
    .catch(next)

}

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
    return res.status(400).json({ error: { message: 'email is invalid' } })
  }

  let postBody = {
    username, email, password
  }
  //let postBody = new UserCustom({ username, email, password })

  hashPassword(password)
    .then(hashedPassword => {
      delete postBody.password
      postBody.password_digest = hashedPassword
    })
    .then(createToken())
    .then(token => postBody.token = token)
    .then(() => {
      return UserService
        .insertUser(knexI, postBody)
        .then(user => {
          res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(sanitize(user))
        })
    })
    .catch(next)

}





module.exports = userRouter
