const UserService = require('../services/user-service')

function post(req, res, next) {
  const knexI = req.app.get('db')
  const { creator_id } = req.body
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ error: { message: 'Not authorized!' } })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id == creator_id) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ error: { message: 'Not authorized!' } })
    })
    .catch(next)
}

module.exports = { post }

