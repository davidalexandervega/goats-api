const app = require('../src/app')
const knex = require('knex')
const {  makeFlyer, makeFlyers } = require('./flyer-fixtures')
const { makeUser } = require('./user-fixtures')
const { seed, truncate } = require('./seed-fixtures')

describe('Flyer endpoints', () => {
  let db;

  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  before('clears all tables', () => {
    return db.raw(truncate.allTables())
  })

  before('insert country, region, city parent data ', () => {
    return db.raw(seed.countryRegionCity())
  })

  before('insert app_user parent data ', () => {
    return db.raw(seed.app_user())
  })

  beforeEach('clears flyer and child tables', () => {
    return db.raw(truncate.flyerChildren())
  })

  afterEach('clears flyer and child tables', () => {
    return db.raw(truncate.flyerChildren())
  })

  after('clears all tables', () => {
    return db.raw(truncate.allTables())
  })

  after('kill knex db', () => {
    return db.destroy()
  })

  describe('GET /api/flyer endpoint', () => {

    context('get flyers only requires an api token', () => {
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/flyer')
          .set({
            "x-api-key": `${process.env.API_KEY}`
          })
          .expect(200, { flyers: [], total: "0" })
      })
    })

  })

  describe('GET /api/flyer/:id endpoint', () => {

    context('get flyer by id only requires an api token', () => {
        beforeEach('insert flyers into flyer', () => {
          return db.raw(seed.flyers())
        })

        it('responds with 200 and flyer', () => {
          const expectedFlyer = makeFlyers()[2]
          return supertest(app)
            .get(`/api/flyer/${expectedFlyer.id}`)
            .set({
              "x-api-key": `${process.env.API_KEY}`
            })
            .expect(200)
        })
    })

  })

})
