const xss = require('xss')
const bcrypt = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto = require('crypto')

const sanitize = user => {
  return {
    id: user.id,
    //token: user.token,
    image_url: xss(user.image_url),
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
    //email: xss(user.email),
    //fullname: xss(user.fullname),
    username: xss(user.username),
    //password_digest: user.password_digest,
    admin: user.admin,
    city_id: user.city_id,
    created: user.created
    //modified: user.modified,
    //last_login: user.last_login.
    //listing_state: user.listing_state
  }
}

const sanitizeAuthed = (user) => {
  return {
    id: user.id,
    token: user.token,
    image_url: xss(user.image_url),
    //facebook_provider_id: user.facebook_provider_id,
    //facebook_provider_token: user.facebook_provider_token,
    email: xss(user.email),
    fullname: xss(user.fullname),
    username: xss(user.username),
    //password_digest: user.password_digest,
    admin: user.admin,
    city_id: user.city_id,
    created: user.created,
    modified: user.modified,
    last_login: user.last_login,
    //listing_state: user.listing_state
  }
}

const sanitizeAdmin = (user) => {
  return {
    id: user.id,
    token: user.token,
    image_url: xss(user.image_url),
    facebook_provider_id: user.facebook_provider_id,
    facebook_provider_token: user.facebook_provider_token,
    email: xss(user.email),
    fullname: xss(user.fullname),
    username: xss(user.username),
    //password_digest: user.password_digest,
    admin: user.admin,
    city_id: user.city_id,
    created: user.created,
    modified: user.modified,
    last_login: user.last_login,
    listing_state: user.listing_state
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
  sanitizeAdmin,
  hashPassword,
  createToken,
  checkPassword
 }
