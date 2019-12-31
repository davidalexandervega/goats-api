const UserService = require('../services/user-service')
const logger = require('../utils/logger.utils')

function post(req, res, next) {
  const knexI = req.app.get('db')
  const { creator_id } = req.body
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ message: `Must be authorized to post.`})
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id == creator_id) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Must be authorized to post.`})
    })
    .catch(next)
}

module.exports = { post }

