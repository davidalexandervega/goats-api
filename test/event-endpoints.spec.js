const app = require('../src/app/app')
const knex = require('knex')

describe('Event endpoints', () => {
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
