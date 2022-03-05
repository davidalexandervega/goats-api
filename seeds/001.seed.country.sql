TRUNCATE event, flyer, app_user, city, region, country  RESTART IDENTITY CASCADE;

COPY country(country_name, country_code)
FROM 'C:\dev\goats-api\seeds\countries.csv' DELIMITER ',' CSV HEADER;
--FROM '/Users/killeraliens/goats-api/seeds/countries.csv' DELIMITER ',' CSV HEADER;

INSERT INTO country
  (country_name, country_code)
  VALUES
    ('West Bank', 'XW'),
    ('Kosovo', 'XK');

-- COPY city(city_name,city_ascii,lat,lng,country,country_code,iso3,admin_name,capital,population,id)
-- FROM '/Users/user/code/killeraliens/goats-api/seeds/worldcities.csv'
-- DELIMITER ',' CSV HEADER;

-- UPDATE city
-- SET admin_name = null
-- WHERE admin_name = '';

-- UPDATE city
-- SET capital = null
-- WHERE capital = '';

-- INSERT INTO city
--   (id, city_name, city_ascii, country, country_code, iso3, lat, lng, admin_name, capital, population)
-- VALUES
--   (1528992666, 'Tilburg', 'Tilburg', 'Netherlands', 'NL', 'NLD', 51.5606, 5.0919, 'Noord-Brabant', 'admin', '217,595')
--   ;
