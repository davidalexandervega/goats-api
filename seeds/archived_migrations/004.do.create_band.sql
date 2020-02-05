CREATE TABLE band (
  id SERIAL PRIMARY KEY,
  description TEXT,
  band_name TEXT,
  image_url TEXT,
  created TIMESTAMP DEFAULT now(),
  modified TIMESTAMP DEFAULT now(),
  creator_id SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
  city_id INT REFERENCES city(id) ON DELETE NO ACTION
);

ALTER TABLE band
ADD CONSTRAINT band_name_city_id UNIQUE
    (band_name, city_id);
