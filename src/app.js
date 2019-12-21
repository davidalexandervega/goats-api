require('dotenv').config()
const { NODE_ENV } = require('./config/config')
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// const flash = require('connect-flash')
// const passport = require('passport')
// const request = require('request')
// const session = require('express-session')
const app = express()
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}

const {
  eventRouter,
  userRouter,
  countryRouter,
  authFbRouter
} = require('./routers')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors(corsOption))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
// app.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: false,
//   saveUninitialized: true
// }))
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// app.use(express.static(path.join(__dirname, '..', '..', 'client')));

app.use('/api/event', eventRouter)
app.use('/api/user', userRouter)
app.use('/api/country', countryRouter)
app.use('/api/v1/', authFbRouter)

app.use(errorHandler)

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
