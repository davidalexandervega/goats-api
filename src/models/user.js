// CREATE TABLE app_user(
//   id SERIAL PRIMARY KEY,
//   token TEXT,
//   image_url TEXT,
//   facebook_provider_id TEXT UNIQUE,
//   facebook_provider_token TEXT,
//   email TEXT,
//   fullname TEXT,
//   username TEXT UNIQUE,
//   password_digest TEXT,
//   admin BOOL DEFAULT false,
//   city_id INT REFERENCES city(id) ON DELETE NO ACTION,
//   created TIMESTAMP DEFAULT now(),
//   modified TIMESTAMP DEFAULT now(),
//   last_login TIMESTAMP
// );

// ALTER TABLE app_user
// ADD COLUMN listing_state listing_state DEFAULT 'Public';

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
