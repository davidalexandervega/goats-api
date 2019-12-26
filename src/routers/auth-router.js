const express = require('express')
const path = require('path')
const UserService = require('../services/user-service')
const { UserCustom } = require('../models/user')
const { createToken, hashPassword, checkPassword } = require('../utils/token.utils')
const bodyParser = express.json()
const xss = require('xss')
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

authRouter
  .route('/signup')
  .post(bodyParser, signup)

authRouter
  .route('/signout')
  .get(signout)


function signout(req, res, next) {
  if(req.user && Object.keys(req.user).length !== 0) {
    delete req.user
    return res.status(204).end()
  }
  delete req.user
  res.status(404).end()
}

function signup(req, res, next) {

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

  //check if username is unique
  // res.status(400).json({ error: { message: 'username already exists' }})

  let newUser = new UserCustom ({
    username,
    email
  })

  hashPassword(password)
    .then(hashedPassword => {
      newUser.password_digest = hashedPassword
    })
    .then(() => createToken())
    .then(token => {
      newUser.token = token
    })
    .then(() => {

      return UserService
        .insertUser(knexI, newUser)
        .then(user => {
          res
            .status(201)
            .location(path.posix.join('/api/user', `/${user.id}`))
            .json(sanitizeAuthed(user))
        })
        .catch(next)
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
        return res.status(404).json({ error: { message: `Check your username or password` } })
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
