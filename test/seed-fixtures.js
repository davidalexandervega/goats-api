const seed = {
  countryCity() {
    return `
      COPY country(country_name, country_code)
      FROM '/Users/user/code/killeraliens/goats-api/seeds/countries.csv' DELIMITER ',' CSV HEADER;

      INSERT INTO country
        (country_name, country_code)
      VALUES
        ('West Bank', 'XW'),
        ('Kosovo', 'XK');

      COPY city(city_name,city_ascii,lat,lng,country,country_code,iso3,admin_name,capital,population,id)
      FROM '/Users/user/code/killeraliens/goats-api/seeds/worldcities.csv'
      DELIMITER ',' CSV HEADER;

      INSERT INTO city
        (id, city_name, city_ascii, country, country_code, iso3, lat, lng, admin_name, capital, population)
      VALUES
        (1528992666, 'Tilburg', 'Tilburg', 'Netherlands', 'NL', 'NLD', 51.5606, 5.0919, 'Noord-Brabant', 'admin', '217,595')
        ;
    `
  },

  models() {
    return `
      INSERT INTO app_user
        (username, email, password_digest, last_login, created, modified)
      VALUES
        ('killer', 'killeraliens@outlook.com', '$2a$10$woR.meJcG0nFVI/kmuSgiurGz.LnwJx0VrCYVtLWaPF1rs5lRJF66', '2019-11-30T19:14:17.915Z', '2019-10-30T19:14:17.915Z', '2019-10-30T19:14:17.915Z'),
        ('aliens', 'alexandrabrinncampbell@gmail.com', '$2a$10$HgAo1uMvj3GpfuTAPgXQ1evGCKOkYRTnn1WgfPkhgF0qCUiNw2E4G', '2019-08-30T19:14:17.915Z', '2019-07-30T19:14:17.915Z', '2019-07-30T19:14:17.915Z')
        ;

      INSERT INTO band
        (band_name, city_id, description, creator_id)
      VALUES
        ('Mortuous', 1840021570, 'Death metal', 1),
        ('Cult Of Fire', 1203744823, 'Black metal', 1),
        ('Mercyful Fate', 1208763942,'Mercyful Fate is a Danish heavy metal band from Copenhagen, formed in 1981 by vocalist King Diamond and guitarist Hank Shermann. Influenced by progressive rock and hard rock, and with lyrics dealing with Satan and the occult, Mercyful Fate were part of the first wave of black metal in the early to mid-1980s.', 1)
        ;

      INSERT INTO venue
        (venue_name, city_id, street_address, postal_code, image_url, creator_id)
      VALUES
        ('Yucca Tap Room', 1840021942, '29 W Southern Ave', '85282', 'https://668517.smushcdn.com/1017521/wp-content/uploads/2019/04/YUCCA-web-logo.png?lossy=1&strip=1&webp=1', 1),
        ('Palo Verde Lounge', 1840021942, '1015 W Broadway Rd', '85282', 'https://s3-media0.fl.yelpcdn.com/bphoto/IouiSfd-WnQaJ33MF5Bv-w/o.jpg', 1),
        ('Little Devil Bar', 1528992666, 'Stationsstraat 27', '5038 EA', 'https://scontent.fphx1-1.fna.fbcdn.net/v/t1.0-9/81026218_1247646112100575_5140321622695084032_o.jpg?_nc_cat=111&_nc_ohc=TtpO74PJEsoAQlMlVylFYeuYT8en9Db7bTAjholtYS8sM4LltSPDNZ91g&_nc_ht=scontent.fphx1-1.fna&oh=9a2252aa38605661115050b4b3ed305f&oe=5EA17A92', 1)
        ;
    `
  },

  event() {
    return `
      INSERT INTO event
        (
          creator_id,
          venue_id,
          image_url,
          event_times,
          title,
          description,
          start_date,
          end_date
        )
      VALUES
        (
          1,
          1,
          'https://1.bp.blogspot.com/-iF7sXspSmXk/W1oQAgNzJEI/AAAAAAAAAPA/FDnYOp28gwQcLqfHAlornSEpqEpKFwXwgCLcBGAs/s1600/Mortuous-Through_Wilderness-flyer%2528web%2529.jpg',
          'Doors at 7pm',
          'Mortuous, Fetid, Hyperdontia',
          'Catch west coast tour before they leave. Extremely Rotten Productions.',
          '2019-12-30T00:00:00.000Z',
          '2019-12-30T00:00:00.000Z'
        );
    `
  },
}

const truncate = {
  allTables() {
    return(`
      TRUNCATE city, country, app_user, venue, event, band, band_event
      RESTART IDENTITY CASCADE
    `)
  },

  userChildren() {
    return(`
      TRUNCATE app_user, venue, event, band, band_event
      RESTART IDENTITY CASCADE
    `)
  },

  eventChildren() {
    return(`
      TRUNCATE event, band_event
      RESTART IDENTITY CASCADE
    `)
  }
}

module.exports = { seed, truncate }
