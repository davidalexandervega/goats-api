CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  token TEXT,
  image_url TEXT,
  facebook_provider_id TEXT UNIQUE,
  facebook_provider_token TEXT,
  email TEXT,
  fullname TEXT,
  username TEXT UNIQUE,
  password_digest TEXT,
  admin BOOL DEFAULT false,
  city_id INT REFERENCES city(id) ON DELETE NO ACTION,
  created TIMESTAMP DEFAULT now(),
  modified TIMESTAMP DEFAULT now(),
  last_login TIMESTAMP
);

