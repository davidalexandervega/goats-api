const eventRouter = require('./event-router');
const flyerRouter = require('./flyer-router')
const userRouter = require('./user-router');
const countryRouter = require('./country-router');
const authFbRouter = require('./auth-fb-router');
const authRouter = require('./auth-router');

module.exports = {
  eventRouter,
  flyerRouter,
  userRouter,
  countryRouter,
  authFbRouter,
  authRouter
}
