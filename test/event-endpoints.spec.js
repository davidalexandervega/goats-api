const app = require('../src/app')
const knex = require('knex')
const { makeUser } = require('./user-fixtures')
// const { makeEvent } = require('./event-fixtures')
const { seed, truncate } = require('./seed-fixtures')

describe.only('Event endpoints', () => {
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

  let authedUser;
  before('signup test user', () => {
    const postBody = makeUser.postBody()
    return supertest(app)
      .post('/api/auth/signup')
      .send(postBody)
      .then(res => {
        authedUser = res.body
      })
  })

  before('insert flyer parent data', () => {
    return db.raw(seed.flyers())
  })

  beforeEach('clears event and child tables', () => {
    return db.raw(truncate.eventChildren())
  })

  afterEach('clears event and child tables', () => {
    return db.raw(truncate.eventChildren())
  })

  after('clears all tables', () => {
    return db.raw(truncate.allTables())
  })

  after('kill knex db', () => {
    return db.destroy()
  })

  describe('GET /api/event endpoint', () => {
    context('given the request token is invalid', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get('/api/event')
          .expect(401, { message: 'Unauthorized.'})
      })
    })

    context('given there are no events in db', () => {
      it('responds with 200 and empty array', () => {
         return supertest(app)
           .get('/api/event')
           .set({
             "Authorization": `Bearer ${authedUser.token}`
           })
           .expect(200, [])
      })
    })

    context('given there are events in the db', () => {
      beforeEach('insert events data', () => {
        return db.raw(seed.events())
      })

      it('responds with 200 and array of events', () => {
        return supertest(app)
          .get('/api/event')
          .set({
            "Authorization": `Bearer ${authedUser.token}`
          })
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.eql(14)
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0].id).to.be.uuid()
            expect(res.body[0]).to.have.property('flyer_id')
            expect(res.body[0].flyer_id).to.be.uuid()
            expect(res.body[0]).to.have.property('event_date')
            expect(res.body[0]).to.have.property('venue_name')
            expect(res.body[0]).to.have.property('city_name')
            expect(res.body[0]).to.have.property('region_name')
            expect(res.body[0]).to.have.property('country_name')
            expect(res.body[0]).to.have.property('city_id')
          })
      })
    })
  })

})
