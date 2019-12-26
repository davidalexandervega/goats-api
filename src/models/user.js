const UserService = require('../services/user-service')

function User() {
  this.username = null;
  this.email = null;
  this.password_digest = null;
  this.token = null;
  this.city_id = null;
  this.fullname = null;
  this.facebook_provider_id = null;
  this.facebook_provider_token = null;
  this.admin = false;
}

function UserCustom({username, email, password_digest, token}) {
  User.call(this)
  this.username = username;
  this.email = email;
  this.password_digest = password_digest;
  this.token = token;
}


function UserFB({fullname, email, facebook_provider_id, facebook_provider_token}) {
  User.call(this)
  this.fullname = fullname;
  this.email = email;
  this.facebook_provider_id = facebook_provider_id;
  this.facebook_provider_token = facebook_provider_token;
}


module.exports = { UserCustom, UserFB };
