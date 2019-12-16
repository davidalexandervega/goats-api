CREATE TABLE app_user (
  id UUID PRIMARY KEY NOT NULL,
  username CHAR(60) UNIQUE,
  password CHAR(60),
  email CHAR(128),
  type TEXT,
  city_id INT REFERENCES city(id) ON DELETE SET NULL
);

