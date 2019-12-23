const express = require('express')
const UserService = require('../services/user-service')
//const bodyParser = express.json()
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

const userRouter = express.Router()

userRouter
  .route('/')
  .get(getAllUsers)

userRouter
  .route('/:id')
  .all(checkExists)
  .get(getById)


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

// function postUser(req, res, next) {
//   const knexI = req.app.get('db')
//   const { username, password, email } = req.body
//   const requiredFields = { username, password, email }

//   for (const [key, value] of Object.entries(requiredFields)) {
//     if (!value) {
//       return res.status(400).json({ error: { message: `${key} required in post body` } })
//     }
//   }

//   const regex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
//   if (!regex.test(email)) {
//     //logger.error(`${url} is not a valid url`)
//     return res.status(400).json({ error: { message: 'email is invalid' } })
//   }

//   //check if username is unique
//   // res.status(400).json({ error: { message: 'username already exists' }})

//   let postBody = {
//     username, email, password
//   }

//   hashPassword(password)
//     .then(hashedPassword => {
//       delete postBody.password
//       postBody.password_digest = hashedPassword
//     })
//     .then(() => createToken())
//     .then(token => {
//       postBody.token = token
//     })
//     .then(() => {
//       return UserService
//         .insertUser(knexI, postBody)
//         .then(user => {
//           res
//           .status(201)
//           .location(path.posix.join(req.originalUrl, `/${user.id}`))
//           .json(sanitizeAuthed(user))
//         })
//     })
//     .catch(next)

// }





module.exports = userRouter
