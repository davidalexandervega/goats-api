const app = require('../src/app')
const knex = require('knex')
const { seed, truncate } = require('./seed-fixtures')

describe('Country endpoints', () => {
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
  })
})
