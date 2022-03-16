const { NODE_ENV } = require('./config')
module.exports = {
  facebookAuth: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || `http:localhost://${process.env.PORT}/auth/facebook/callback`,
    profileUrl: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  },
  sendgridAuth: {
    API_KEY: process.env.SENDGRID_API_KEY,
    IS_SANDBOX: NODE_ENV === "test"
  },
  cloudinaryConfig: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  }
}
