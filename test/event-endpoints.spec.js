const app = require('../src/app')
const knex = require('knex')

describe('Event endpoints', () => {
  let db;
  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clears event and child tables', () => {
    return db.raw(`TRUNCATE event, band_event RESTART IDENTITY CASCADE`)
  })

  beforeEach('clears event and child tables', () => {
    return db.raw(`TRUNCATE event, band_event RESTART IDENTITY CASCADE`)
  })

  afterEach('clears event and child tables', () => {
    return db.raw(`TRUNCATE event, band_event RESTART IDENTITY CASCADE`)
  })

  after('kill knex db', () => {
    return db.destroy()
  })

  describe('GET /api/event endpoint', () => {
    context('given there are no events in db', () => {
      it('responds with 200 and empty array', () => {
         return supertest(app)
           .get('/api/event')
           .expect(200, [])
      })
    })
  })
})
