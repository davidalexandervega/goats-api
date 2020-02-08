const makeFlyer = {
  postBody() {
    return {
      // id: db default uuid,
      // creator_id: set in test,
      flyer_type: 'Show',
      image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946115/84749251_2670611672988679_3051998756900700160_n.jpg.jpg',
      headline: 'Show Headline',
      bands: 'Band1, Band2, Band3, etc..',
      details: 'Some details',
      publish_comment: 'More info soon',
      listing_state: 'Public',
      //created: db default,
      //modified: db default,
      events: [
        {
          // id: db default uuid,
          // flyer_id: db default uuid from flyer,
          date: '2020-07-22T00:00:00.000Z',
          venue_name: 'Test Tavern',
          city_name: 'Phoenix',
          region_name: 'AZ',
          country_name: 'United States',
          city_id: null
        }
      ]
    }
  },

  // withBannedListingState() {
  //   return {
  //     id: 'a8c64ea8-389f-4702-a1d5-a79336f201e0',
  //     creator_id: ,
  //     flyer_type: 'Show',
  //     image_url: 'https://res.cloudinary.com/killeraliens/image/upload/v1580946115/84749251_2670611672988679_3051998756900700160_n.jpg.jpg',
  //     headline: 'Show Headline',
  //     bands: 'Band1, Band2, Band3, etc..',
  //     details: 'Some details',
  //     publish_comment: 'More info soon',
  //     listing_state: 'Public',
  //     //created: db default,
  //     //modified: db default,
  //       '1c7ca37e-48f2-11ea-b77f-2e728ce88125',
  //       '4904c18c-48ee-11ea-b77f-2e728ce88125',
  //       'Show',
  //       'https://res.cloudinary.com/killeraliens/image/upload/v1581001608/82800556_3011524808871060_725602104382586880_o.jpg.jpg',
  //       'Antichrist Siege Machine (ASM) with Bloodlust and more',
  //       'ASM  - War Metal from Richmond https://stygianblackhand.bandcamp.com/album/schism-perpetration, BLOODLUST https://bloodlustphx.bandcamp.com/album/bloodlust, and more...',
  //       '$10 at the door, CASH ONLY, more info soon',
  //       'https://www.facebook.com/events/3403867453016788/',
  //       'Public',
  //       '2020-01-23T22:42:14.355Z',
  //       '2020-01-23T22:42:14.355Z'
  //     )
  //   }
  // },

}

module.exports = { makeFlyer }
