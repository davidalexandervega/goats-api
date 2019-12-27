const CityService = {
  getAllCities(knex) {
    return knex
      .select('*')
      .from('city')
  },

  getCitiesByCountry(knex, country_code) {
    return knex
      .select('*')
      .from('city')
      .where('country_code', country_code)
  }
}

module.exports = CityService;
