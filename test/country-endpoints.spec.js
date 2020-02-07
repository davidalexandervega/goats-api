const app = require('../src/app')
const knex = require('knex')
const { seed, truncate } = require('./seed-fixtures')

describe.only('Country endpoints', () => {
  let db;
  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  before('clears country and all child tables', () => {
    return db.raw(truncate.allTables())
  })

  beforeEach('clears country and all child tables', () => {
    return db.raw(truncate.allTables())
  })

  afterEach('clears country and all child tables', () => {
    return db.raw(truncate.allTables())
  })

  after('kill knex db', () => {
    return db.destroy()
  })

  describe('GET /api/country endpoint', () => {
    context('given there are no countries in db', () => {
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/country')
          .expect(200, [])
      })
    })

    context('there are countries loaded', () => {
      beforeEach('seed countries', () => {
        return db.raw(seed.countryRegionCity())
      })
      it('responds with 200 and array of all countries', () => {
        return supertest(app)
          .get('/api/country')
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.eql(251)
            expect(res.body[0]).to.have.property('country_code')
            expect(res.body[0].country_code.length).to.eql(2)
            expect(res.body[0]).to.have.property('country_name')
            expect(res.body[0].country_name.length).to.be.at.least(1)
            expect(res.body[0]).to.have.property('lat')
            expect(res.body[0]).to.have.property('lng')
            expect(res.body[0]).to.have.property('image_url')
          })
      })
    })
  })


})
