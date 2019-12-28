
// function User() {
//   this.id;
//   this.created = new Date(Date.now());
//   this.modified = new Date(Date.now());
//   this.admin = false;
//   this.last_login = null;
//   this.username = null;
//   this.email = null;
//   this.password_digest = null;
//   this.token = null;
//   this.city_id = null;
//   this.fullname = null;
//   this.facebook_provider_id = null;
//   this.facebook_provider_token = null;
// }

function UserCustom({ username, email, password_digest, token }) {
  this.username = username;
  this.email = email;
  this.password_digest = password_digest;
  this.token = token;
}

function UserFB({ fullname, email, facebook_provider_id, facebook_provider_token }) {
  this.fullname = fullname;
  this.email = email;
  this.facebook_provider_id = facebook_provider_id;
  this.facebook_provider_token = facebook_provider_token;
  this.city_id = null;
  this.username = null;
}


module.exports = {
  UserCustom, UserFB
};
