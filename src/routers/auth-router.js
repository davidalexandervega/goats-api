const express = require('express')
const path = require('path')
const UserService = require('../services/user-service')
const UserUtils = require('../utils/user.utils')
const bodyParser = express.json()
const logger = require('../utils/logger.utils')
const { check, validationResult, body, sanitizedBody } = require('express-validator');

const authRouter = express.Router()

authRouter
  .route('/signin')
  .post(bodyParser, signin)

authRouter
  .route('/signup')
  .post(
    bodyParser,
    [
      check('username').custom((value, { req }) => {
        const knexI = req.app.get('db')
        return UserService.getByUsername(knexI, value).then(user => {
            if (user) {
              return Promise.reject(`Username ${value} is already in use.`);
            }
        })
      })
    ],
    signup
  )

authRouter
  .route('/check')
  .post(
    bodyParser,
    getByIdToken
  )

authRouter
  .route('/signout')
  .get(signout)


function signout(req, res) {
  if(req.user && Object.keys(req.user).length !== 0) {
    logger.info(`successful GET /signout by ${req.user.id}`)
    delete req.user
    return res.status(204).end()
  }
  delete req.user
  logger.error('unauthed req.user GET /signout')
  res.status(404).end()
}

function signup(req, res, next) {
  const validErrors = validationResult(req)
  if (!validErrors.isEmpty()) {
    logger.error(`POST /signup 400 error ${validErrors.errors[0].msg}`)
    return res.status(400).json({ message: validErrors.errors[0].msg })
  }

  const knexI = req.app.get('db')
  const { username, password, email } = req.body
  const requiredFields = { username, password, email }

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      logger.error(`POST /signup missing required value ${key}`)
      return res.status(400).json({ error: { message: `${key} required in post body` } })
    }
  }

  const regex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  if (!regex.test(email)) {
    logger.error(`POST /signup ${url} is not a valid url`)
    return res.status(400).json({ error: { message: 'email is invalid' } })
  }

  //check if username is unique
  // res.status(400).json({ error: { message: 'username already exists' }})

  const newUser = {
    username: username,
    email: email
  }

  UserUtils.hashPassword(password)
    .then(hashedPassword => {
      newUser.password_digest = hashedPassword
    })
    .then(() => UserUtils.createToken())
    .then(token => {
      newUser.token = token
      let now = Date.now()
      let last_login = new Date(now)
      newUser.last_login = last_login
    })
    .then(() => {

      return UserService
        .insertUser(knexI, newUser)
        .then(user => {
          //logger.info(`successful POST /signup by username ${user.username}`)
          res
            .status(201)
            .location(path.posix.join('/api/user', `/${user.id}`))
            .json(UserUtils.sanitizeAuthed(user))
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
      logger.error(`POST /signin missing required value ${key}`)
      return res.status(400).json({ error: { message: `${key} required for signin` } })
    }

  }
  let user;

  UserService
    .getByUsername(knexI, username)
    .then(foundUser => {
      if (!foundUser) {
        logger.error(`POST /signin username ${username} does not exist`)
        return res.status(401).json({ message: `Bad login credentials` })
      }
      user = foundUser

      return UserUtils.checkPassword(password, foundUser)
        .then(res => res)
        .catch(err => res.status(401).json(err))
    })
    .then(result => UserUtils.createToken())
    .then(token => {
      let now = Date.now()
      let last_login = new Date(now)
      user.token = token
      user.last_login = last_login
      const patchBody = { token, last_login }
      return UserService
        .updateUser(knexI, user.id, patchBody)
        .catch(next)
    })
    .then(() => {
      delete user.password_digest
      //logger.info(`Successful POST /signin by username ${user.username}`)
      res.status(201).json(UserUtils.sanitizeAuthed(user))
    })
    .catch(next)

}

//write tests
function getByIdToken(req, res, next) {
  const knexI = req.app.get('db')
  const { id, token } = req.body

  UserService
    .getByIdToken(knexI, id, token)
    .then(user => {
      if (!user) {
        logger.error(`POST /auth/check user ${id} not found`)
        return res.status(404).json({message: 'User not found.'})
      }
      return user
    })
    .then(user => {
      if (!user.token || user.token != token) {
        logger.error(`POST /auth/check token ${token} for user ${id} expired or null`)
        return res.status(401).json({message: 'Unauthorized.'})
      }
      return res.status(200).json(user)
    })
}

module.exports = authRouter;
