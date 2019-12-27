const xss = require('xss')
const bcrypt = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto = require('crypto')

const sanitize = user => {
  return {
    id: user.id,
    username: xss(user.username),
    city_id: user.city_id,
    //password: xss(user.password),
    //email: xss(user.email),
    //fullname: xss(user.fullname),
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
    admin: user.admin
  }
}

const sanitizeAuthed = user => {
  return {
    id: user.id,
    username: xss(user.username),
    city_id: user.city_id,
    token: user.token,
    //password: xss(user.password),
    email: xss(user.email),
    fullname: xss(user.fullname),
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
    admin: user.admin
  }
}


const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'))
    })
  })
}

const checkPassword = (password, foundUser) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, foundUser.password_digest, (error, response) => {
      if (error) {
        reject(error)
      } else if (response) {
        resolve(response)
      } else {
        reject({ message: 'Passwords do not match.' })
      }
    })
  })
}


module.exports = {
  sanitize,
  sanitizeAuthed,
  hashPassword,
  createToken,
  checkPassword
 }
