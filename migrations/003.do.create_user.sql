CREATE TABLE app_user (
  id UUID PRIMARY KEY NOT NULL,
  facebook_provider_id TEXT UNIQUE,
  facebook_provider_token TEXT,
  email TEXT,
  fullname TEXT,
  username TEXT UNIQUE,
  password TEXT,
  type TEXT,
  city_id INT REFERENCES city(id) ON DELETE SET NULL
);

