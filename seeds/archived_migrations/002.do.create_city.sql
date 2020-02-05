CREATE TABLE city (
  city_name TEXT NOT NULL,
  city_ascii TEXT,
  lat FLOAT,
  lng FLOAT,
  country TEXT,
  country_code TEXT REFERENCES country(country_code) ON DELETE CASCADE,
  iso3 TEXT,
  admin_name TEXT,
  capital TEXT,
  population TEXT,
  id INT PRIMARY KEY
);

-- https://simplemaps.com/data/world-cities


