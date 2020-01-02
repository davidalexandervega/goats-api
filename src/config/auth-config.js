module.exports = {
  facebookAuth: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || `http:localhost://${process.env.PORT}/auth/facebook/callback`,
    profileUrl: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  }

}
