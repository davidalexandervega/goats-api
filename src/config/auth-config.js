module.exports = {
  facebookAuth: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CB_URL || `http:localhost://${process.env.PORT}/auth/facebook/callback`,
    profileUrl: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
  }
}
