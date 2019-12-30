const makeEvent = {
  seeded1() {
    return {
      id: 1, // not in seed
      creator_id: 1,
      venue_id: 1,
      image_url: 'https://1.bp.blogspot.com/-iF7sXspSmXk/W1oQAgNzJEI/AAAAAAAAAPA/FDnYOp28gwQcLqfHAlornSEpqEpKFwXwgCLcBGAs/s1600/Mortuous-Through_Wilderness-flyer%2528web%2529.jpg',
      event_times: 'Doors at 7pm',
      title: 'Mortuous, Fetid, Hyperdontia',
      description: 'Catch west coast tour before they leave. Extremely Rotten Productions.',
      start_date: '2019-12-30T00:00:00.000Z',
      end_date: '2019-12-30T00:00:00.000Z'
    }
  },

  postBodyMin() {
    return {
      creator_id: 1,
      image_url: 'https://thumbs.worthpoint.com/zoom/images1/1/0416/10/vintage-mercyful-fate-poster_1_f8b6fba67726fd6b35ee65aa8076e3eb.jpg',
      title: 'Merciful Fate RETURNS'
    }
  }
}

module.exports = { makeEvent }
