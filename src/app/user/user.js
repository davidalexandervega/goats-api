function UserCustom(id, username, email, password) {
  this.id = id;
  this.username = username;
  this.email = email;
  this.password = password;
  this.city_id = null;
  this.fullname = null;
  this.facebook_provider_id = null;
  this.facebook_provider_token = null;
  this.type = 'entry';
}


function UserFB(id, fullname, email, facebook_provider_id, facebook_provider_token) {
  this.id = id;
  this.fullname = fullname;
  this.email = email;
  this.facebook_provider_id = facebook_provider_id;
  this.facebook_provider_token = facebook_provider_token;
  // this.city_id = null;
  // this.username = null;
  // this.password = null;
  //this.type = 'entry';
}


module.exports = { UserCustom, UserFB };
