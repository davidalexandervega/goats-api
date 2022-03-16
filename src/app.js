require('dotenv').config()
const { NODE_ENV, API_KEY } = require('./config/config')
const express = require('express')
const logger = require('./utils/logger.utils')

const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const formData = require('express-form-data')

const app = express()
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'
// const { CLIENT_ORIGIN } = require('./config');
// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   })
// );
const {
  flyerRouter,
  eventRouter,
  userRouter,
  countryRouter,
  authFbRouter,
  authRouter
} = require('./routers')
const UserService = require('./services/user-service')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(setReqUserBearerToken)
app.use(setReqAppAccessToken)
app.use('/api/v1', authFbRouter)
app.use('/api/auth', authRouter)
app.use('/api', eventRouter)
app.use('/api/user', userRouter)
app.use('/api/country', countryRouter)
app.use('/api/flyer', flyerRouter)
app.use(formData.parse())
app.post('/api/image-upload', (req, res) => {
  const values = Object.values(req.files)
  const promises = values.map(image =>
    cloudinary.v2.uploader.upload(image.path, {
      angle: 'exif'
    })
  )

  Promise
    .all(promises)
    .then(results => {
      return res.json(results)
    } )
    .catch(error => {
      console.log('error inside img upload')
      logger.error(`500 Error message: ${error.message}`)
    })
})
app.use(errorHandler)

function setReqUserBearerToken(req, res, next) {
  const knexI = req.app.get('db')
  const authHeader = req.get('Authorization')
  const bearerToken = authHeader ? authHeader.split(' ')[1] : null;

  if (!bearerToken) {
    req.user = {}
    return next()
  }

  UserService.getByToken(knexI, bearerToken)
    .then(user => {
      if (!user) {
        req.user = {}
        return next()
      } else if (!req.user) {
        req.user = {}
      }

      req.user.token = bearerToken
      return next()
    })
    .catch(next)

}

function setReqAppAccessToken(req, res, next) {
  const appAuthHeader = req.get('x-api-key')
  req.appToken = appAuthHeader || null

  return next()
}

function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === "production") {
    logger.error(`500 Error message: ${error.message}`)
    response = { error: { message: "Server Error" } }
  } else {
    console.log(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
}

module.exports = app
