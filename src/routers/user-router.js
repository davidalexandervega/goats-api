const express = require('express')
const UserService = require('../services/user-service')
const UserUtils = require('../utils/user.utils')
const bodyParser = express.json()
const logger = require('../utils/logger.utils')

const userRouter = express.Router()

userRouter
  .route('/')
  .get(getAllUsers)

userRouter
  .route('/:id')
  .all(checkExists)
  .get(getById)
  .patch(bodyParser, authenticatePatch, patchUser)


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
      //res.user = user
      res.user = user

      next()
    })
    .catch(next)
}

function authenticatePatch(req, res, next) {
  const knexI = req.app.get('db')
  const { id } = req.params
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ error: { message: 'Not authorized!' } })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id == id) {
        req.user = user
        //console.log('SETTING req USER', req.user)
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ error: { message: 'Not authorized!' } })
    })
    .catch(next)
}

function isAuthenticated(knexI, id, reqUser) {
  const { token } = reqUser
  if (!token) {
    return false
  }
  return UserService
    .getByToken(knexI, token)
    .then(user => {
      if (user.id == id) {
        return true
      }
      return false
    })
}

function getById(req, res, next) {
  const knexI = req.app.get('db')

  if(isAuthenticated(knexI, res.user.id, req.user)) {
    logger.info(`Successful GET /user/:id by authed user ${res.user.id}`)
    return res.json(UserUtils.sanitizeAuthed(res.user))
  }
  logger.info(`Successful GET /user/:id by public user`)
  res.json(UserUtils.sanitize(res.user))
}

function getAllUsers(req, res, next) {
  const knexI = req.app.get('db')
  UserService
    .getAllUsers(knexI)
    .then(users => {
      logger.info(`Successful GET /user by user`)
      const sanitized = users.map(user => UserUtils.sanitize(user))
      res.json(sanitized)
    })
    .catch(next)
}

function patchUser(req, res, next) {
  const knexI = req.app.get('db')
  const { id } = req.params
  const { username, password, fullname, city_id, email } = req.body
  const userReq = { username, password, fullname, city_id, email }


  const arrWithVals = Object.values(userReq).filter(val => val)
  if (arrWithVals.length === 0) {
    logger.error(`PATCH /user/${id} Request body must contain at least one required field`)
    return res.status(400).json({ message: 'Request body must contain at least one required field'})
  }

  let patchBody

  if(password) {
    const password_digest = UserUtils.hashPassword(password) //validate and encrypt
    patchBody = { username, fullname, password_digest, city_id, email }
  } else {
    //validate all as in signup
    patchBody = { username, fullname, city_id, email }
  }

  UserService
    .updateUser(knexI, id, patchBody)
    .then(numOfFieldsAffected => {
      logger.info(`Successful PATCH /user/${id}, affecting ${numOfFieldsAffected} fields`)
      return res.status(204).end()
    })
    .catch(next)

}






module.exports = userRouter
