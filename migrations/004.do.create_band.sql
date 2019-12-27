CREATE TABLE band (
  id SERIAL PRIMARY KEY,
  description TEXT,
  band_name TEXT,
  created TIMESTAMP DEFAULT now(),
  modified TIMESTAMP DEFAULT now(),
  creator SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
  city_id INT REFERENCES city(id) ON DELETE NO ACTION
);

ALTER TABLE band
ADD CONSTRAINT name_city UNIQUE
    (band_name, city_id);
