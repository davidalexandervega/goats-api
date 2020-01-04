# How to seed your heroku with csv (and no superuser permission)

## country
in your terminal
```cli
psql -h ec2-75-101-128-10.compute-1.amazonaws.com -U oyvcsxiqmtywvq -d dd0onut0viuj9r -c "\copy country (country_name, country_code) FROM './seeds/countries.csv' with (format csv,header true, delimiter ',');"
```
add missing countries
```SQL
INSERT INTO country
  (country_name, country_code)
VALUES
  ('West Bank', 'XW'),
  ('Kosovo', 'XK');
```

## city
```cli
psql -h ec2-75-101-128-10.compute-1.amazonaws.com -U oyvcsxiqmtywvq -d dd0onut0viuj9r -c "\copy city (city_name,city_ascii,lat,lng,country,country_code,iso3,admin_name,capital,population,id) FROM './seeds/worldcities.csv' with (format csv,header true, delimiter ',');"
```

```SQL
INSERT INTO city
  (id, city_name, city_ascii, country, country_code, iso3, lat, lng, admin_name, capital, population)
VALUES
  (1528992666, 'Tilburg', 'Tilburg', 'Netherlands', 'NL', 'NLD', 51.5606, 5.0919, 'Noord-Brabant', 'admin', '217,595')
  ;
```
