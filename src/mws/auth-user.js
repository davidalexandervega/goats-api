const UserService = require('../services/user-service')
const logger = require('../utils/logger.utils')

function post(req, res, next) {
  const knexI = req.app.get('db')
  const { creator_id } = req.body
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ message: `Unauthorized.`})
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id == creator_id) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Unauthorized.`})
    })
    .catch(next)
}

function get(req, res, next) {
  const knexI = req.app.get('db')
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized, no token`)
    return res.status(401).json({ message: `Unauthorized.` })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (Boolean(user.id)) {
        // req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Unauthorized` })
    })
    .catch(next)
}

function deleteFlyer(req, res, next) {
  const knexI = req.app.get('db')
  const creator_id = res.flyer.creator_id
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ message: `Unauthorized.` })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id === creator_id) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Unauthorized.` })
    })
    .catch(next)
}

module.exports = { post, get, deleteFlyer }

