TRUNCATE country;

COPY country(country_name, country_code)
FROM '/Users/user/code/killeraliens/goats-api/seeds/countries.csv' DELIMITER ',' CSV HEADER;
