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
      if (user.id === creator_id) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Unauthorized.`})
    })
    .catch(next)
}

function patchUser(req, res, next) {
  const knexI = req.app.get('db')
  const { id } = req.params
  const { token } = req.user
  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ error: { message: 'Not authorized' } })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id == id) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ error: { message: 'Not authorized!' } })
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
      if (user.token === token) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Unauthorized` })
    })
    .catch(next)
}

function manageFlyer(req, res, next) {
  const knexI = req.app.get('db')
  const { creator_id } = res.flyer
  const { token } = req.user

  if (!token) {
    logger.error(`Not authorized!`)
    return res.status(401).json({ message: `Unauthorized.` })
  }

  UserService.getByToken(knexI, token)
    .then(user => {
      if (user.id === creator_id || user.admin === true) {
        req.user = user
        return next()
      }
      logger.error(`Not authorized!`)
      return res.status(401).json({ message: `Unauthorized.` })
    })
    .catch(next)
}

// This auth mw is done using validation techniques inside /auth-endpoints
function resetPassword(req, res, next) {
  const knexI = req.app.get('db')
  const { token } = req.user
  const { username } = req.body

  UserService.getByUsername(knexI, username)
    .then(user => {
      if(!user) {
        return res.status(401).json({ message: `Username ${username} does not exist.` })
      } else if (!token) {
        return res.status(401).json({ message: `Unauthorized.` })
      } else if (!!token && user.token !== token) {
        return res.status(401).json({ message: 'This token has expired.' })
      } else {
        return next()
      }
    })
    .catch(next)
}



module.exports = { post, get, manageFlyer, patchUser, resetPassword }

