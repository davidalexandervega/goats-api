const express = require('express')
const UserService = require('../services/user-service')
const UserUtils = require('../utils/user.utils')
const bodyParser = express.json()
const logger = require('../utils/logger.utils')
const authUser = require('../mws/auth-user')
const { check, validationResult } = require('express-validator');

const userRouter = express.Router()

userRouter
  .route('/')
  .get(getAllUsers)

userRouter
  .route('/:id')
  .all(checkExists)
  .get(authUser.get, getById)
  .patch(
    bodyParser,
    authUser.patchUser,
    [
      check('username')
        .custom((value, { req }) => {
          const knexI = req.app.get('db')
          const { id } = req.params
          if(!!value) {
            return UserService.getByUsername(knexI, value).then(user => {
              if (user && user.id !== id) {
                return Promise.reject(`Username ${value} is already in use.`);
              }
            })
          }
        })
        .optional(),
      check('password')
        .isAlphanumeric()
        .isLength({ min: 5, max: 20 })
        .withMessage('Password must be between 5 and 20 characters.')
        .optional(),
      check('password')
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric.')
        .optional(),
      check('email')
        .isEmail()
        .withMessage('Incorrect format for email.')
        .optional()
    ],
    patchUser
    )


function checkExists(req, res, next) {
  const { id } = req.params
  const db = req.app.get('db')

  UserService
    .getById(db, id)
    .then(user => {
      if (!user) {
        logger.error(`User with id ${id} does not exist`)
        return res.status(404).json({ error: { message: `User doesn't exist` } })
      }
      res.user = user
      next()
    })
    .catch(error => {
      if (!!error.message && (/(invalid input syntax for type uuid)/.test(error.message)) ) {
        return res.status(404).json({ error: { message: `User doesn't exist` } })
      }
      next(error)
    })
}

async function getById(req, res, next) {
  const knexI = req.app.get('db')
  const isAuthed = await UserUtils.isAuthenticated(knexI, res.user.id, req.user)

  if (isAuthed === true) {
    return res.json(UserUtils.sanitizeAuthed(res.user))
  }
  res.json(UserUtils.sanitize(res.user))
}

function getAllUsers(req, res, next) {
  const knexI = req.app.get('db')
  UserService
    .getAllUsers(knexI)
    .then(users => {
      const sanitized = users.map(user => UserUtils.sanitize(user))
      res.json(sanitized)
    })
    .catch(next)
}

function patchUser(req, res, next) {
  const { id } = req.params
  const { username, password, email, image_url, fullname, city_name, region_name, country_name, city_id } = req.body
  const userReq = {
    username,
    password,
    email,
    image_url,
    fullname,
    city_name,
    region_name,
    country_name,
    city_id
  }

  const arrWithVals = Object.values(userReq).filter(val => val)
  if (arrWithVals.length === 0) {
    logger.error(`PATCH /user/${id} Request body must contain at least one required field`)
    return res.status(400).json({ message: 'Request body must contain at least one required field'})
  }

  const validErrors = validationResult(req)
  if (!validErrors.isEmpty()) {
    logger.error(`PATCH /user/:id 400 error ${validErrors.errors[0].msg}`)
    return res.status(400).json({ message: validErrors.errors[0].msg })
  }

  const knexI = req.app.get('db')
  const { ...patchBody } = req.body

  if (!!patchBody.password) {
    UserUtils
    .hashPassword(password)
    .then(password_digest => {
      delete patchBody.password
      delete patchBody.admin
      delete patchBody.user_state
      delete patchBody.id
      patchBody.password_digest = password_digest
      UserService
        .updateUser(knexI, id, patchBody)
        .then(numOfFieldsAffected => {
          return res.status(204).end()
        })
        .catch(next)
    })
  } else {
    delete patchBody.admin
    delete patchBody.user_state
    delete patchBody.id
    UserService
      .updateUser(knexI, id, patchBody)
      .then(numOfFieldsAffected => {
        return res.status(204).end()
      })
      .catch(next)
  }
}






module.exports = userRouter
