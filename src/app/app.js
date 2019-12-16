require('dotenv').config()
const { NODE_ENV } = require('../config/config')
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

const eventRouter = require('./event/eventRouter')
const userRouter = require('./user/userRouter');
const authRouter = require('./routes/authRouter');

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors(corsOption))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
//app.use(express.static(path.join(__dirname, 'public')))
// app.use(session({
//   secret: 'anystringwilldo',
//   saveUninitialized: true,
//   resave: true
// }))
// app.use(passport.initialize())
// app.use(session())
// app.use(flash())

app.use('/api/event', eventRouter)
app.use('/api/user', userRouter)
app.use('/api/v1/', authRouter)

// app.post('/api/v1/auth/facebook', (req, res, next) => {
//   const tokenBlob = req.body
//   // res.json({message: tokenBlob.size})
//   res.send('got the token blob')

// })

// app.get('/auth/facebook', passport.authenticate('facebook'))
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook',
//     {
//       successRedirect: '/',
//       failureRedirect: '/login'
//     }
//   )
// )

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
