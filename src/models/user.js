const UserService = require('../services/user-service')
const xss = require('xss')

class User {
  constructor() {
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

}



class UserCustom extends User {
  constructor({ username, email, password_digest, token }) {
    super();
    this.username = username;
    this.email = email;
    this.password_digest = password_digest;
    this.token = token;
  }

}


class UserFB extends User {
  constructor({fullname, email, facebook_provider_id, facebook_provider_token}) {
    super();
    this.fullname = fullname;
    this.email = email;
    this.facebook_provider_id = facebook_provider_id;
    this.facebook_provider_token = facebook_provider_token;
  }
}


module.exports = { UserCustom, UserFB, User };
