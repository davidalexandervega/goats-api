const eventRouter = require('./event-router')
const userRouter = require('./user-router');
const countryRouter = require('./country-router');
const authFbRouter = require('./auth-fb-router');

module.exports = {
  eventRouter,
  userRouter,
  countryRouter,
  authFbRouter
}