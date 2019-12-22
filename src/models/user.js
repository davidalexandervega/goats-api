const UserService = require('../services/user-service')

function UserCustom({username, email, password_digest, token}) {
  this.username = username;
  this.email = email;
  this.password_digest = password_digest;
  this.token = token;
  this.city_id = null;
  this.fullname = null;
  this.facebook_provider_id = null;
  this.facebook_provider_token = null;
  this.admin = false;
}


function UserFB(fullname, email, facebook_provider_id, facebook_provider_token) {
  this.fullname = fullname;
  this.email = email;
  this.facebook_provider_id = facebook_provider_id;
  this.facebook_provider_token = facebook_provider_token;
  this.city_id = null;
  this.username = null;
  this.password_digest = null;
  this.admin = false;
}


module.exports = { UserCustom, UserFB };
