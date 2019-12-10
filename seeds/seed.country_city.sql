TRUNCATE city, country CASCADE;

COPY country(country_name, country_code)
FROM '/Users/user/code/killeraliens/goats-api/seeds/countries.csv' DELIMITER ',' CSV HEADER;

INSERT INTO country
  (country_name, country_code)
VALUES
  ('West Bank', 'XW'),
  ('Kosovo', 'XK');

COPY city(city_name,city_ascii,lat,lng,country,country_id,iso3,admin_name,capital,population,id)
FROM '/Users/user/code/killeraliens/goats-api/seeds/worldcities.csv'
DELIMITER ',' CSV HEADER;
