const express = require('express')
const UserService = require('../services/user-service')
const UserUtils = require('../utils/user.utils')
const bodyParser = express.json()

const userRouter = express.Router()

userRouter
  .route('/')
  .get(getAllUsers)

userRouter
  .route('/:id')
  .all(checkExists)
  .get(getById)
  .patch(bodyParser, authenticate, patchUser)


function checkExists(req, res, next) {
  const { id } = req.params
  const db = req.app.get('db')

  UserService
    .getById(db, id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: { message: `User doesn't exist` } })
      }
      //res.user = user
      res.user = user

      next()
    })
    .catch(next)
}

function authenticate(req, res, next) {
  const knexI = req.app.get('db')
  const { id } = req.params
  const { token } = req.user
  if (!token) {
    return res.status(401).json({ error: { message: 'must be authenticated' } })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id == id) {
        req.user = user
        //console.log('SETTING req USER', req.user)
        return next()
      }
      return res.status(403).json({ error: { message: 'must be authenticated' } })
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
   // return res.json(sanitizeAuthed(res.user))
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
  const knexI = req.app.get('db')
  const { id } = req.params
  const { username, password, fullname, city_id, email } = req.body
  const userReq = { username, password, fullname, city_id, email }


  const arrWithVals = Object.values(userReq).filter(val => val)
  if (arrWithVals.length === 0) {
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
    .then(() => {
      return res.status(204).end()
    })
    .catch(next)

}






module.exports = userRouter
