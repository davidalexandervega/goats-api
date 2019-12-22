const express = require('express')
//const path = require('path')
const UserService = require('../services/user-service')
//const { UserCustom } = require('../models/user')
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
    admin: user.admin
  }
}
const sanitizeAuthed = user => {
  return {
    id: user.id,
    username: xss(user.username),
    city_id: user.city_id,
    token: user.token,
    //password: xss(user.password),
    email: xss(user.email),
    fullname: xss(user.fullname),
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
    admin: user.admin
  }
}

const authRouter = express.Router()

authRouter
  .route('/signin')
  .post(bodyParser, signin)


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
      return checkPassword(password, foundUser)
    })
    .then(result => createToken())
    .then(token => {
      user.token = token
      const patchBody = { token }
      return UserService
        .updateUser(knexI, user.id, patchBody)
        .catch(next)
    })
    .then(() => {
      delete user.password_digest
      res.json(sanitizeAuthed(user))
    })
    .catch(next)

}


module.exports = authRouter;
