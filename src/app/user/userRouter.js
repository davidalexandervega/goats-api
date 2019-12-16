const express = require('express')
const UserService = require('./user-service')
const bodyParser = express.json()
const xss = require('xss')
const sanitize = user => {
  return {
    id: user.id,
    username: xss(user.username),
    //password: xss(user.password),
    email: xss(user.email),
    //type: ,
    //city_id
  }
}

const userRouter = express.Router()

userRouter
  .route('/')
  .get(getAllUsers)
  .post(postUser)

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

function postUser(req, res, next) {
  const knexI = req.app.get('db')
  console.log('req BODY', req.body)
  console.log('RES', res)
  //res.json({message: 'check console'})
  return next()
}


module.exports = userRouter
