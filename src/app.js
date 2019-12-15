require('dotenv').config()
const { NODE_ENV } = require('./config')
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const passport = require('passport')
const request = require('request')
const session = require('express-session')
const path = require('path')
const app = express()
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(session({
  secret: 'anystringwilldo',
  saveUninitialized: true,
  resave: true
}))
app.use(passport.initialize())
app.use(session())
app.use(flash())

//app.use(passportLocalStrategy)
// app.get('/', (req, res) => {
//   res.send('Hello boilerplate')
// })
//app.use('/user', userRouter)
app.use(errorHandler)

// function passportLocalStrategy(req, res, next) {
//   return new LocalStrategy(username, password)
// }

function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === "production") {
    response = { error: { message: "Server Error" } }
  } else {
    console.log(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
}

module.exports = app
