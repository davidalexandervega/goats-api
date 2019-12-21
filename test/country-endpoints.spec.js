const app = require('../src/app')
const knex = require('knex')

describe('Country endpoints', () => {
  let db;
  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clears country table', () => {
    return db.raw('TRUNCATE city, country, app_user')
  })

  beforeEach('clears country table', () => {
    return db.raw('TRUNCATE city, country, app_user')
  })

  afterEach('clears country table', () => {
    return db.raw('TRUNCATE city, country,  app_user')
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
  })
})
