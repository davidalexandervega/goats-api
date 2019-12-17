CREATE TABLE app_user (
  id UUID PRIMARY KEY NOT NULL,
  facebookProvider_id TEXT UNIQUE,
  facebookProvider_token TEXT,
  email CHAR(128),
  fullname CHAR(128),
  username CHAR(60) UNIQUE,
  password CHAR(60),
  type TEXT,
  city_id INT REFERENCES city(id) ON DELETE SET NULL
);