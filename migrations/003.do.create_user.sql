CREATE TABLE app_user (
  id SERIAL PRIMARY KEY NOT NULL,
  token TEXT,
  facebook_provider_id TEXT UNIQUE,
  facebook_provider_token TEXT,
  email TEXT,
  fullname TEXT,
  username TEXT UNIQUE,
  password_digest TEXT,
  admin BOOL DEFAULT false,
  city_id INT REFERENCES city(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

