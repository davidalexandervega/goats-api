function UserCustom(username, email, password) {
  this.username = username;
  this.email = email;
  this.password = password;
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
  this.password = null;
  this.admin = false;
}


module.exports = { UserCustom, UserFB };
