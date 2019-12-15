CREATE TABLE app_user (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  type TEXT,
  city_id INT REFERENCES city(id) ON DELETE SET NULL
);

