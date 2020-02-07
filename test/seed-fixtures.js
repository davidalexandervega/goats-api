const seed = {
  countryRegionCity() {
    return `
      COPY country(country_name, country_code)
      FROM '/Users/user/code/killeraliens/goats-api/seeds/countries.csv' DELIMITER ',' CSV HEADER;

      INSERT INTO country
        (country_name, country_code)
      VALUES
        ('West Bank', 'XW'),
        ('Kosovo', 'XK');

      INSERT INTO city
        (id, city_name, city_ascii, country, country_code, iso3, lat, lng, admin_name, capital, population)
      VALUES
        (1528992666, 'Tilburg', 'Tilburg', 'Netherlands', 'NL', 'NLD', 51.5606, 5.0919, 'Noord-Brabant', 'admin', '217,595')
     ;
    `
  },

  models() {
    return `
      INSERT INTO app_user (
        id,
        username,
        email,
        image_url,
        fullname,
        admin,
        country_name,
        region_name,
        city_name,
        user_state,
        created,
        modified,
        last_login
      )
      VALUES (
          'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
          'killer',
          'killeraliens@outlook.com',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580673041/lzasvcgmviuqa3fuo724.jpg',
          'Alexandra aka Ali',
          true,
          'United States',
          'Arizona',
          'Phoenix',
          'Public',
          '2019-11-30T19:14:17.915Z',
          '2020-01-03T19:14:17.915Z',
          '2020-01-03T19:14:17.915Z'
        ),
        (
          '097f2ce6-48ee-11ea-b77f-2e728ce88125',
          'greyalien',
          'greyalien@sampleemail.com',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946417/roswell-ufo-alien-CREDIT-GETTY-1120.jpg',
          null,
          false,
          'Belgium',
          null,
          'Ghent',
          'Public',
          '2019-01-05T20:42:00.000Z',
          '2019-01-05T20:42:00.000Z',
          '2019-01-05T20:42:00.000Z'
        ),
        (
          '4904c18c-48ee-11ea-b77f-2e728ce88125',
          'devilmaster',
          'devilmaster@sampleemail.com',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946398/devils_3_legend_production_company.jpg',
          'Chris Cross',
          false,
          'Denmark',
          null,
          'Copenhagen',
          'Public',
          '2019-01-03T00:00:00.000Z',
          '2019-01-03T18:00:00.000Z',
          '2019-01-03T18:00:00.000Z'
        ),
        (
          '591ff7a8-48ee-11ea-b77f-2e728ce88125',
          'demonbaby',
          'demonbaby@sampleemail.com',
          null,
          null,
          false,
          null,
          null,
          null,
          'Public',
          '2020-02-02T14:08:00.000Z',
          '2020-02-02T14:08:00.000Z',
          '2020-02-02T14:08:00.000Z'
        )
        ;

      INSERT INTO flyer (
        id,
        creator_id,
        flyer_type,
        image_url,
        headline,
        bands,
        details,
        publish_comment,
        listing_state,
        created,
        modified
      )
      VALUES
        (
          'a28ebf8c-48ee-11ea-b77f-2e728ce88125',
          'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
          'Total Death Over Mexico lll',
          'Necrovation (Suecia), Imprecation (USA), Saturnalia Temple (Suecia), Anatomia (Japón), Nyogthaeblisz (USA), BHL (USA), Galvanizer (Finlandia), Necrot (USA), Crurifragium (USA), Question (México), Sepolcro (Italia), Ritual Necromancy (USA), Nightfell (USA), Void Rot (USA), Demonisium (México), Of Feather and Bone (USA), Evil Spectrum (Peru), Autophagy (USA), Slutvomit (USA), Mortuous (USA), Ossuary (USA), Mortiferum (USA), Necros Christos (Germany), Lvcifyre (UK), Demilich (Finland), Denial (MEX), Cavernus (MEX), Druid Lord (USA)',
          'Foro San Rafael Av. Ribera de San Cosme #28, 06470 Mexico City, Mexico. Check out their fb page https://www.facebook.com/events/foro-san-rafael/total-death-over-mexico-lll-informativo/1004824666540845/',
          null,
          'Public',
          '2020-01-03T16:03:22.000Z',
          '2020-01-03T16:03:22.000Z'
        ),
        (
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '097f2ce6-48ee-11ea-b77f-2e728ce88125',
          'Tour',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946342/75521841_2571097956311369_9029394387301302272_o1.jpg',
          'RIPPIKOULU / CHTHE’ILIST / NUCLEUS — 2020 North American Tour',
          'RIPPIKOULU, CHTHE’ILIST, NUCLEUS',
          'Read More: Finnish death doom vets Rippikoulu touring with Chthe’ilist & Nucleus | http://www.brooklynvegan.com/finnish-death-doom-vets-rippikoulu-touring-with-chtheilist-nucleus/?trackback=tsmclip',
          'Found this on Brooklyn Vegan http://www.brooklynvegan.com/finnish-death-doom-vets-rippikoulu-touring-with-chtheilist-nucleus/',
          'Public',
          '2019-01-05T19:42:00.000Z',
          '2019-01-05T19:42:00.000Z'
        ),
        (
          '6932cad2-48f1-11ea-b77f-2e728ce88125',
          '4904c18c-48ee-11ea-b77f-2e728ce88125',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1581001296/81886107_2710011682400996_3673221855931531264_o.jpg.jpg',
          'Killtown Deathfest VIII - "10 Years of Death"',
          'Lineup TBA',
          'Pumpehuset Studiestræde 52, 1554 Copenhagen https://www.facebook.com/events/2806422816089129/',
          'Check fb for band updates. Link is in details.',
          'Public',
          '2020-01-23T21:42:14.355Z',
          '2020-01-23T21:42:14.355Z'
        ),
        (
          '1c7ca37e-48f2-11ea-b77f-2e728ce88125',
          '4904c18c-48ee-11ea-b77f-2e728ce88125',
          'Show',
          'https://res.cloudinary.com/killeraliens/image/upload/v1581001608/82800556_3011524808871060_725602104382586880_o.jpg.jpg',
          'Antichrist Siege Machine (ASM) with Bloodlust and more',
          'ASM  - War Metal from Richmond https://stygianblackhand.bandcamp.com/album/schism-perpetration, BLOODLUST https://bloodlustphx.bandcamp.com/album/bloodlust, and more...',
          '$10 at the door, CASH ONLY, more info soon',
          'https://www.facebook.com/events/3403867453016788/',
          'Public',
          '2020-01-23T22:42:14.355Z',
          '2020-01-23T22:42:14.355Z'
        )
        ;
    `
  },

  // event() {
  //   return `
  //     INSERT INTO event
  //       (
  //         creator_id,
  //         venue_id,
  //         image_url,
  //         event_times,
  //         title,
  //         description,
  //         start_date,
  //         end_date
  //       )
  //     VALUES
  //       (
  //         1,
  //         1,
  //         'https://1.bp.blogspot.com/-iF7sXspSmXk/W1oQAgNzJEI/AAAAAAAAAPA/FDnYOp28gwQcLqfHAlornSEpqEpKFwXwgCLcBGAs/s1600/Mortuous-Through_Wilderness-flyer%2528web%2529.jpg',
  //         'Doors at 7pm',
  //         'Mortuous, Fetid, Hyperdontia',
  //         'Catch west coast tour before they leave. Extremely Rotten Productions.',
  //         '2019-12-30T00:00:00.000Z',
  //         '2019-12-30T00:00:00.000Z'
  //       );
  //   `
  // },
}

const truncate = {
  allTables() {
    return(`
      TRUNCATE event, flyer, app_user, city, region, country
      RESTART IDENTITY CASCADE
    `)
  },

  userChildren() {
    return(`
      TRUNCATE event, flyer, app_user
      RESTART IDENTITY CASCADE
    `)
  },

  // eventChildren() {
  //   return(`
  //     TRUNCATE event, band_event
  //     RESTART IDENTITY CASCADE
  //   `)
  // }
}

module.exports = { seed, truncate }
