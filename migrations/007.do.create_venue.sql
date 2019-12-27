CREATE TABLE venue (
   id SERIAL PRIMARY KEY,
   creator SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
   venue_name TEXT,
   is_private BOOLEAN DEFAULT FALSE,
   street_address TEXT,
   postal_code TEXT,
   city_id INT REFERENCES city(id) ON DELETE NO ACTION,
   created TIMESTAMP DEFAULT now(),
   modified TIMESTAMP DEFAULT now()
);
