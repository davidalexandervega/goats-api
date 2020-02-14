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

  app_user() {
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
    `
  },

  usersWithBannedOrArchivedState() {
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
      VALUES
        (
          '347ef3f3-2538-426b-9f9f-533b569dc2e3',
          'archivedgreyalien',
          'archivedgreyalien@sampleemail.com',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946417/roswell-ufo-alien-CREDIT-GETTY-1120.jpg',
          null,
          false,
          'Belgium',
          null,
          'Ghent',
          'Archived',
          '2019-01-05T20:42:00.000Z',
          '2019-01-05T20:42:00.000Z',
          '2019-01-05T20:42:00.000Z'
        ),
        (
          '1cbc998b-da7f-4700-ba45-efacecd26d94',
          'bannedusername',
          'bannedkilleraliens@outlook.com',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580673041/lzasvcgmviuqa3fuo724.jpg',
          'Banned Alexandra aka Ali',
          false,
          'United States',
          'Arizona',
          'Phoenix',
          'Banned',
          '2019-11-30T19:14:17.915Z',
          '2020-01-03T19:14:17.915Z',
          '2020-01-03T19:14:17.915Z'
        ),
        (
          '031d4af6-0832-49d6-ad1c-0d0ed7541339',
          'privatedevilmaster',
          'privatedevilmaster@sampleemail.com',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946398/devils_3_legend_production_company.jpg',
          'Private Chris Cross',
          false,
          'Denmark',
          null,
          'Copenhagen',
          'Private',
          '2019-01-03T00:00:00.000Z',
          '2019-01-03T18:00:00.000Z',
          '2019-01-03T18:00:00.000Z'
        )
        ;
    `
  },

  flyers() {
    return `
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

  flyersWithBannedOrArchivedState() {
    return `
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
          'a8c64ea8-389f-4702-a1d5-a79336f201e0',
          'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
          'Archived Headline',
          'Archived bands',
          'Archived details',
          'Archived publish comment',
          'Archived',
          '2020-01-03T16:03:22.000Z',
          '2020-01-05T16:03:22.000Z'
        ),
        (
          '8764e84f-fb32-4822-a159-44cc30147dac',
          'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
          'Banned Headline',
          'Banned bands',
          'Banned details',
          'Banned publish comment',
          'Banned',
          '2020-02-03T16:03:22.000Z',
          '2020-02-05T16:03:22.000Z'
        ),
        (
          'ee53a883-b8d6-4dbf-93b2-8dabfc53d7a5',
          'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
          'Draft Headline',
          'Draft bands',
          'Draft details',
          'Draft publish comment',
          'Draft',
          '2020-02-03T16:03:22.000Z',
          '2020-02-03T16:03:22.000Z'
        )
    `
  },

  flyersWithBannedOrArchivedCreatorState() {
    return `
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
          '25e97ea0-6d6e-4430-8023-72143661a4de',
          '347ef3f3-2538-426b-9f9f-533b569dc2e3',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
          'ARCHIVED CREATOR Public Headline',
          'Public bands',
          'Public details',
          'Public publish comment',
          'Public',
          '2020-01-03T16:03:22.000Z',
          '2020-01-05T16:03:22.000Z'
        ),
        (
          'ee528ee0-39c8-44bb-b2a2-540f9b05219f',
          '1cbc998b-da7f-4700-ba45-efacecd26d94',
          'Fest',
          'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
          'BANNED CREATOR Public Headline',
          'Public bands',
          'Public details',
          'Public publish comment',
          'Public',
          '2020-01-03T16:03:22.000Z',
          '2020-01-05T16:03:22.000Z'
        )
    `
  },

  events() {
    return `
      INSERT INTO event (
        id,
        flyer_id,
        event_date,
        venue_name,
        city_name,
        region_name,
        country_name,
        city_id
      )
      VALUES
        (
          '906d8774-48f4-11ea-b77f-2e728ce88125',
          'a28ebf8c-48ee-11ea-b77f-2e728ce88125',
          '2020-03-13T00:00:00.000Z',
          'Foro San Rafael',
          'Mexico City',
          null,
          'Mexico',
          null
        ),
        (
          '9acbfa16-48f4-11ea-b77f-2e728ce88125',
          'a28ebf8c-48ee-11ea-b77f-2e728ce88125',
          '2020-03-14T00:00:00.000Z',
          'Foro San Rafael',
          'Mexico City',
          null,
          'Mexico',
          null
        ),
        (
          'a2fb5362-48f4-11ea-b77f-2e728ce88125',
          'a28ebf8c-48ee-11ea-b77f-2e728ce88125',
          '2020-03-15T00:00:00.000Z',
          'Foro San Rafael',
          'Mexico City',
          null,
          'Mexico',
          null
        ),
        (
          'ac671dc8-48f4-11ea-b77f-2e728ce88125',
          'a28ebf8c-48ee-11ea-b77f-2e728ce88125',
          '2020-03-16T00:00:00.000Z',
          'Foro San Rafael',
          'Mexico City',
          null,
          'Mexico',
          null
        ),
        (
          '5a7d4a0e-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-03T00:00:00.000Z',
          'Maple Grove Tavern',
          'Clevland',
          'OH',
          'United States',
          null
        ),
        (
          '62b299fe-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-04T00:00:00.000Z',
          'TBD',
          'Detroit',
          'MI',
          'United States',
          null
        ),
        (
          '6af351b2-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-05T00:00:00.000Z',
          'Cobra Lounge',
          'Chicago',
          'IL',
          'United States',
          null
        ),
        (
          '74de12f2-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-06T00:00:00.000Z',
          'Black Circle Brewing',
          'Indianapolis',
          'IN',
          'United States',
          null
        ),
        (
          '80bf6cec-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-07T00:00:00.000Z',
          'TBD',
          'Columbus',
          'OH',
          'United States',
          null
        ),
        (
          '88c6a400-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-08T00:00:00.000Z',
          'Cativo''s',
          'Pittsburgh',
          'PA',
          'United States',
          null
        ),
        (
          '90b0d6cc-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-09T00:00:00.000Z',
          'Metro Gallery',
          'Baltimore',
          'MD',
          'United States',
          null
        ),
        (
          '973a5a04-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-10T00:00:00.000Z',
          'Kung Fu Necktie',
          'Philadelphia',
          'PA',
          'United States',
          null
        ),
        (
          '9ed5309a-48f5-11ea-b77f-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-11T00:00:00.000Z',
          'Saint Vitus',
          'New York',
          'NY',
          'United States',
          null
        ),
        (
          'a7afef3e-48f5-11ea-8456-2e728ce88125',
          '83e0779a-48f0-11ea-b77f-2e728ce88125',
          '2020-04-12T00:00:00.000Z',
          'Piranha Bar',
          'Montreal',
          'QC',
          'Canada',
          null
        ),
        (
          '50862d34-885d-48cb-8ad0-6b4da488135f',
          '6932cad2-48f1-11ea-b77f-2e728ce88125',
          '2020-09-03T00:00:00.000Z',
          'Pumpehuset',
          'Copenhagen',
          null,
          'Denmark',
          null
        ),
        (
          'bf9f0bf4-b941-4b3e-9616-31ce71d69c6c',
          '6932cad2-48f1-11ea-b77f-2e728ce88125',
          '2020-09-04T00:00:00.000Z',
          'Pumpehuset',
          'Copenhagen',
          null,
          'Denmark',
          null
        ),
        (
          '37cbaad3-c23b-4492-8ad3-2e87ba19fd49',
          '6932cad2-48f1-11ea-b77f-2e728ce88125',
          '2020-09-05T00:00:00.000Z',
          'Pumpehuset',
          'Copenhagen',
          null,
          'Denmark',
          null
        ),
        (
          '1242df4b-e6b1-4a45-b052-49f70bd2194f',
          '6932cad2-48f1-11ea-b77f-2e728ce88125',
          '2020-09-06T00:00:00.000Z',
          'Pumpehuset',
          'Copenhagen',
          null,
          'Denmark',
          null
        ),
        (
          '81eb96ce-de51-4903-b15c-68be6a72fbf9',
          '1c7ca37e-48f2-11ea-b77f-2e728ce88125',
          '2020-04-16T00:00:00.000Z',
          'MASTER''S CHAMBERS',
          'Phoenix',
          'AZ',
          'United States',
          null
        )
        ;
    `
  }

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

  flyerChildren() {
    return `
      TRUNCATE event, flyer
      RESTART IDENTITY CASCADE
    `
  },

  eventChildren() {
    return(`
      TRUNCATE event
      RESTART IDENTITY CASCADE
    `)
  }


}

module.exports = { seed, truncate }
