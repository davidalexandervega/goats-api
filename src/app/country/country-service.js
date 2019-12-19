const CountryService = {
  getAllCountries(knex) {
    return knex
      .select('*')
      .from('country')
  },
}

module.exports = CountryService;
