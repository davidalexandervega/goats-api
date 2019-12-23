require('dotenv').config()
const { NODE_ENV, API_KEY } = require('./config/config')
const express = require('express')
//const favicon = require('serve-favicon')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')
// const request = require('request')
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
  authFbRouter,
  authRouter
} = require('./routers')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors(corsOption))
//app.use(validateBearerToken)
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
////
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}))
// app.use(passport.initialize({ passReqToCallback: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, '..', '..', 'client')));
//////

app.use('/api/event', eventRouter)
app.use('/api/user', userRouter)
app.use('/api/country', countryRouter)
app.use('/api/v1', authFbRouter)
app.use('/api/auth', authRouter)

app.use(errorHandler)

function validateBearerToken(req, res, next) {
  const apiToken = API_TOKEN
  const authHeader = req.get('Authorization')
  const bearerToken = authHeader ? authHeader.split(' ')[1] : null;

  if (!bearerToken || bearerToken !== apiToken) {
    logger.error(`Unauthorized request to ${req.path}`)
    return res
      .status(403)
      .json({ error: 'Unauthorized request' })
  }
  next()
}

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
