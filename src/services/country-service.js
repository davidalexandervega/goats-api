const CountryService = {
  getAllCountries(knex) {
    return knex
      .select('*')
      .from('country')
  },

  getByCode(knex, code) {
    return knex
      .select('*')
      .from('country')
      .where('country_code', 'ilike', code )
      .first()
  }
}

module.exports = CountryService;
