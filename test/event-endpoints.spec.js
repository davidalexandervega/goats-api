const app = require('../src/app')
const knex = require('knex')
const { makeUser } = require('./user-fixtures')
// const { makeEvent } = require('./event-fixtures')
const { seed, truncate } = require('./seed-fixtures')

describe('Event endpoints', () => {
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
            assert.isArray(res.body)
            expect(res.body.length).to.eql(19)
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
            expect(res.body[0]).to.have.property('cancelled')
            expect(res.body[0].cancelled).to.be.a('boolean')
            const eventsCancelled = res.body.filter(event => event.cancelled === true).length
            expect(eventsCancelled).to.eql(9)
          })
      })
    })
  })

  describe.only('GET /api/country-region-hash endpoint', () => {
    context('given the request token is invalid', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get('/api/country-region-hash')
          .expect(401, { message: 'Unauthorized.' })
      })
    })

    context('given there are no events in db', () => {
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/country-region-hash')
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

      it('responds with 200 and array of region_name, country_name, event count hashes', () => {
        return supertest(app)
          .get('/api/country-region-hash')
          .set({
            "Authorization": `Bearer ${authedUser.token}`
          })
          .expect(200)
          .expect(res => {
            assert.isArray(res.body)
            res.body.forEach(hash => {
              expect(hash).to.have.property('country_name')
              expect(hash.country_name).to.not.be.null
              expect(hash.country_name).to.not.be.empty
              expect(hash).to.have.property('per_country')
              expect(hash.per_country).to.not.be.null
              expect(hash.per_country).to.not.be.empty
              if (hash.country_name === 'United States') expect(hash.per_country).to.equal('10')
              expect(hash).to.have.property('upcoming_per_country')
              expect(hash.upcoming_per_country).to.not.be.null
              expect(hash.upcoming_per_country).to.not.be.empty
              if (hash.country_name === 'United States') expect(hash.upcoming_per_country).to.equal('1')
              expect(hash).to.have.property('regions')
              assert.isArray(hash.regions)
              hash.regions.forEach(region => {
                assert.isObject(region)
                expect(region).to.have.property('region_name')
                expect(region.region_name).to.not.be.null
                expect(region.region_name).to.not.be.empty
                expect(region).to.have.property('country_name')
                expect(region.country_name).to.not.be.null
                expect(region.country_name).to.not.be.empty
                expect(region).to.have.property('per_region')
                if (region.region_name === 'AZ') expect(region.per_region).to.equal('1')
                expect(region.per_region).to.not.be.null
                expect(region).to.have.property('upcoming_per_region')
                expect(region.upcoming_per_region).to.not.be.null
                expect(region.upcoming_per_region).to.not.be.empty
                if (region.region_name === 'AZ') expect(region.upcoming_per_region).to.equal('1')
              })
            })
          })
      })

      context('given a flyer creator user_state is set to Private', () => {
        beforeEach('make flyer creator user_state Private', () => {
          return db('app_user')
            .where({ id: authedUser.id })
            .update({
              user_state: 'Private'
            })
            .then(() => {
              return db('app_user')
                .select('*')
                .where({ id: authedUser.id })
                .first()
                .then(privateAuthedUser => {
                  authedUser = privateAuthedUser
                   return db('flyer')
                     .where('id', '1c7ca37e-48f2-11ea-b77f-2e728ce88125')
                     .update({
                       creator_id: authedUser.id
                     })
                })

            })
        })

        afterEach('revert flyer creator user_state back to Public again', () => {
            return db('app_user')
              .where({ id: authedUser.id })
              .update({
                user_state: 'Public'
              })
              .then(() => {
                return db('app_user')
                  .select('*')
                  .where({ id: authedUser.id })
                  .first()
                  .then(publicAuthedUser => {
                    authedUser = publicAuthedUser
                  })
              })
        })

        it('will not return event counts from a private user', () => {
          return supertest(app)
            .get('/api/country-region-hash')
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              assert.isArray(res.body)
              res.body.forEach(hash => {
                if (hash.country_name === 'United States') expect(hash.per_country).to.equal('9')
                if (hash.country_name === 'United States') expect(hash.upcoming_per_country).to.equal('0')
                hash.regions.forEach(region => {
                  expect(region.region_name).to.not.equal('AZ')
                })
            })
          })
        })
      })

      context('given a flyer listing state is Draft', () => {
        beforeEach('set a flyer listing state to Draft', () => {
          return db('flyer')
            .where('id', '1c7ca37e-48f2-11ea-b77f-2e728ce88125')
            .update({
              listing_state: 'Draft'
            })
        })

        afterEach('revert flyer listing_state back to Public again', () => {
          return db('flyer')
            .where('id', '1c7ca37e-48f2-11ea-b77f-2e728ce88125')
            .update({
              listing_state: 'Public'
            })
        })

        it('will not return event counts for a draft flyer', () => {
          return supertest(app)
            .get('/api/country-region-hash')
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              assert.isArray(res.body)
              res.body.forEach(hash => {
                if (hash.country_name === 'United States') expect(hash.per_country).to.equal('9')
                if (hash.country_name === 'United States') expect(hash.upcoming_per_country).to.equal('0')
                hash.regions.forEach(region => {
                  expect(region.region_name).to.not.equal('AZ')
                })
              })
            })
        })
      })
    })
  })
})
