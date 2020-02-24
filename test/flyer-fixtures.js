function makeFlyers() {
    return [
      {
        id: '1c7ca37e-48f2-11ea-b77f-2e728ce88125',
        creator_id: '4904c18c-48ee-11ea-b77f-2e728ce88125',
        flyer_type: 'Show',
        image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1581001608/82800556_3011524808871060_725602104382586880_o.jpg.jpg',
        headline: 'Antichrist Siege Machine (ASM) with Bloodlust and more',
        bands: 'ASM  - War Metal from Richmond https://stygianblackhand.bandcamp.com/album/schism-perpetration, BLOODLUST https://bloodlustphx.bandcamp.com/album/bloodlust, and more...',
        details: '$10 at the door, CASH ONLY, more info soon',
        publish_comment: 'https://www.facebook.com/events/3403867453016788/',
        listing_state: 'Public',
        created: '2020-01-23T22:42:14.355Z',
        modified: '2020-01-23T22:42:14.355Z',
        creator_username: 'devilmaster',
        creator_image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946398/devils_3_legend_production_company.jpg',
        events: []
      },
      {
        id: '6932cad2-48f1-11ea-b77f-2e728ce88125',
        creator_id: '4904c18c-48ee-11ea-b77f-2e728ce88125',
        flyer_type: 'Fest',
        image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1581001296/81886107_2710011682400996_3673221855931531264_o.jpg.jpg',
        headline: 'Killtown Deathfest VIII - "10 Years of Death"',
        bands: 'Lineup TBA',
        details: 'Pumpehuset Studiestræde 52, 1554 Copenhagen https://www.facebook.com/events/2806422816089129/',
        publish_comment: 'Check fb for band updates. Link is in details.',
        listing_state: 'Public',
        created: '2020-01-23T21:42:14.355Z',
        modified: '2020-01-23T21:42:14.355Z',
        creator_username: 'devilmaster',
        creator_image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946398/devils_3_legend_production_company.jpg',
        events: []
      },
      {
        id: 'a28ebf8c-48ee-11ea-b77f-2e728ce88125',
        creator_id: 'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
        flyer_type: 'Fest',
        image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946259/84928856_2664439773605869_7793911911774420992_n.jpg.jpg',
        headline: 'Total Death Over Mexico lll',
        bands: 'Necrovation (Suecia), Imprecation (USA), Saturnalia Temple (Suecia), Anatomia (Japón), Nyogthaeblisz (USA), BHL (USA), Galvanizer (Finlandia), Necrot (USA), Crurifragium (USA), Question (México), Sepolcro (Italia), Ritual Necromancy (USA), Nightfell (USA), Void Rot (USA), Demonisium (México), Of Feather and Bone (USA), Evil Spectrum (Peru), Autophagy (USA), Slutvomit (USA), Mortuous (USA), Ossuary (USA), Mortiferum (USA), Necros Christos (Germany), Lvcifyre (UK), Demilich (Finland), Denial (MEX), Cavernus (MEX), Druid Lord (USA)',
        details: 'Foro San Rafael Av. Ribera de San Cosme #28, 06470 Mexico City, Mexico. Check out their fb page https://www.facebook.com/events/foro-san-rafael/total-death-over-mexico-lll-informativo/1004824666540845/',
        publish_comment: '',
        listing_state: 'Public',
        created: '2020-01-03T16:03:22.000Z',
        modified: '2020-01-03T16:03:22.000Z',
        creator_username: 'killer',
        creator_image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580673041/lzasvcgmviuqa3fuo724.jpg',
        events: []
      },
      {
        id: '83e0779a-48f0-11ea-b77f-2e728ce88125',
        creator_id: '097f2ce6-48ee-11ea-b77f-2e728ce88125',
        flyer_type: 'Tour',
        image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946342/75521841_2571097956311369_9029394387301302272_o1.jpg',
        headline: 'RIPPIKOULU / CHTHE’ILIST / NUCLEUS — 2020 North American Tour',
        bands: 'RIPPIKOULU, CHTHE’ILIST, NUCLEUS',
        details: 'Read More: Finnish death doom vets Rippikoulu touring with Chthe’ilist & Nucleus | http://www.brooklynvegan.com/finnish-death-doom-vets-rippikoulu-touring-with-chtheilist-nucleus/$1trackback=tsmclip',
        publish_comment: 'Found this on Brooklyn Vegan http://www.brooklynvegan.com/finnish-death-doom-vets-rippikoulu-touring-with-chtheilist-nucleus/',
        listing_state: 'Public',
        created: '2019-01-05T19:42:00.000Z',
        modified: '2019-01-05T19:42:00.000Z',
        creator_username: 'greyalien',
        creator_image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946417/roswell-ufo-alien-CREDIT-GETTY-1120.jpg',
        events: []
      }
    ]

}

const makeFlyer = {

  postBody() {
    return {
      // creator_id: set in test logged in user,
      flyer_type: 'Fest',
      image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946115/84749251_2670611672988679_3051998756900700160_n.jpg.jpg',
      headline: 'Fest Headline',
      bands: 'Band1, Band2, Band3, etc..',
      details: '', // details: null, sanitizer makes empty string!
      publish_comment: 'More info soon',
      // listing_state: 'Public',
      events: [
        {
          // id: db default uuid,
          // flyer_id: db default uuid from flyer,
          event_date: '2020-07-22T00:00:00.000Z',
          venue_name: 'Test Tavern',
          city_name: 'Phoenix',
          region_name: 'AZ',
          country_name: 'United States',
          city_id: null
        },
        {
          // id: db default uuid,
          // flyer_id: db default uuid from flyer,
          event_date: '2020-07-23T00:00:00.000Z',
          venue_name: 'Test Tavern',
          city_name: 'Phoenix',
          region_name: 'AZ',
          country_name: 'United States',
          city_id: null
        }
      ]
    }
  },

  patchBody() {
    return {
      headline: 'Updated Fest Headline',
      publish_comment: 'Updated More info soon',
      events: [
          {
            // id: db default uuid, should be completely new event id
            // flyer_id: db default uuid from flyer,
            event_date: '2020-07-22T00:00:00.000Z',
            venue_name: 'Updated Test Tavern',
            city_name: 'Phoenix',
            region_name: 'AZ',
            country_name: 'United States',
            city_id: null
          },
          {
            // id: db default uuid, should be completely new event id
            // flyer_id: db default uuid from flyer,
            event_date: '2020-07-23T00:00:00.000Z',
            venue_name: 'Updated Test Tavern',
            city_name: 'Phoenix',
            region_name: 'AZ',
            country_name: 'United States',
            city_id: null
          },
          {
            // id: db default uuid, should be completely new event id
            // flyer_id: db default uuid from flyer,
            event_date: '2020-07-24T00:00:00.000Z',
            venue_name: 'Updated Test Tavern',
            city_name: 'Phoenix',
            region_name: 'AZ',
            country_name: 'United States',
            city_id: null
          }
      ]
    }
  },

  postBodyWithXss() {
    return {
      flyer_type: 'Fest',
      image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946115/84749251_2670611672988679_3051998756900700160_n.jpg.jpg',
      headline: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      bands: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      details: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      publish_comment: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      events: [
        {
          venue_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          city_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          region_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          country_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          city_id: null
        },
        {
          venue_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          city_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          region_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          country_name: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          city_id: null
        }
      ]
    }
  },

  postBodyWithXssResponseSanitized() {
    return {
      flyer_type: 'Fest',
      image_url: `https://res.cloudinary.com/killeraliens/image/upload/v1580946115/84749251_2670611672988679_3051998756900700160_n.jpg.jpg`,
      headline: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      bands: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      details: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      publish_comment: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      events: [
        {
          venue_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          city_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          region_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          country_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          city_id: null
        },
        {
          venue_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          city_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          region_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          country_name: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          city_id: null
        }
      ]
    }
  },


  withXss() {
    return {
      id: '524b0c0a-3ea5-4fe7-8bb6-3e20c57e4a53',
      creator_id: 'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
      flyer_type: 'Show',
      image_url: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      headline: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      bands: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      details: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      publish_comment: 'naughty <script>alert("xss");</script> Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      listing_state: 'Public'
    }
  },

  withSanitizedXss() {
    return {
      id: '524b0c0a-3ea5-4fe7-8bb6-3e20c57e4a53',
      creator_id: 'ef6f4b60-48ed-11ea-b77f-2e728ce88125',
      flyer_type: 'Show',
      image_url: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      headline: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      bands: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      details: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      publish_comment: `naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      listing_state: 'Public'
    }
  }

}

module.exports = { makeFlyer, makeFlyers }
