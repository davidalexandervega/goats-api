const bcrypt = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto = require('crypto')

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
      if(error) {
        reject(error)
      } else if (response) {
        resolve(response)
      } else {
        reject(new Error('Passwords do not match.'))
      }
    })
  })
}


module.exports = {
  hashPassword,
  createToken,
  checkPassword
};
