const app = require('../src/app')
const knex = require('knex')
const { makeUser } = require('./user-fixtures')
const { makeEvent } = require('./event-fixtures')
const { seed, truncate } = require('./seed-fixtures')

describe('Event endpoints', () => {
  let db;

  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clears all tables', () => {
    return db.raw(truncate.allTables())
  })

  before('insert country city table data', () => {
    return db.raw(seed.countryCity())
  })

  // before('signup two users', () => {
  //   creator = makeUser.postBody()
  //   guest = makeUser.postBody2()
  //   return supertest(app)
  //     .post(`/api/auth/signup`)
  //     .send(creator)
  //     .then(res => {
  //       creator = res.body;
  //     })
  //     .then(() => {
  //       return supertest(app)
  //         .post(`/api/auth/signup`)
  //         .send(guest)
  //         .then(res => {
  //           guest = res.body
  //         })
  //     })
  // })

  before('insert (models) user, band, venue (event parents) table data', () => {
    return db.raw(seed.models())
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
    context('given there are no events in db', () => {
      it('responds with 200 and empty array', () => {
         return supertest(app)
           .get('/api/event')
           .expect(200, [])
      })
    })

    context('given there are events in the db', () => {
      beforeEach('insert events data', () => {
        return db.raw(seed.event())
      })

      it('responds with 200 and array with accurate seeded event fields', () => {
        const expectedEvent = makeEvent.seeded1()
        return supertest(app)
          .get('/api/event')
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.eql(1)
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0].id).to.eql(expectedEvent.id)
            expect(res.body[0].id).to.not.eql(null)
            expect(res.body[0].creator_id).to.eql(expectedEvent.creator_id)
            expect(res.body[0]).to.have.property('venue_id')
            expect(res.body[0].venue_id).to.eql(expectedEvent.venue_id)
            expect(res.body[0]).to.have.property('image_url')
            expect(res.body[0].image_url).to.eql(expectedEvent.image_url)
            expect(res.body[0].image_url).to.not.eql(null)
            expect(res.body[0]).to.have.property('event_times')
            expect(res.body[0].event_times).to.eql(expectedEvent.event_times)
            expect(res.body[0]).to.have.property('title')
            expect(res.body[0].title).to.eql(expectedEvent.title)
            expect(res.body[0].title).to.not.eql(null)
            expect(res.body[0]).to.have.property('description')
            expect(res.body[0].description).to.eql(expectedEvent.description)
            expect(res.body[0]).to.have.property('start_date')
            expect(res.body[0].start_date).to.eql(expectedEvent.start_date)
            expect(res.body[0]).to.have.property('end_date')
            expect(res.body[0].end_date).to.eql(expectedEvent.end_date)
            const expectedCreatedTimestamp = new Date(Date.now()).toLocaleString()
            const actualCreatedTimestamp = new Date(res.body[0].created).toLocaleString()
            expect(actualCreatedTimestamp).to.eql(expectedCreatedTimestamp)
            expect(res.body[0]).to.have.property('created')
            expect(res.body[0].created).to.not.eql(null)
            //expect(res.body[0].created).to.eql(expectedEvent.created)
            const expectedModifiedTimestamp = new Date(Date.now()).toLocaleString()
            const actualModifiedTimestamp = new Date(res.body[0].modified).toLocaleString()
            expect(actualModifiedTimestamp).to.eql(expectedModifiedTimestamp)
            expect(res.body[0]).to.have.property('modified')
            expect(res.body[0].modified).to.not.eql(null)
            //expect(res.body[0].modified).to.eql(expectedEvent.modified)
            expect(res.body[0].listing_state).to.eql(undefined)
          })
      })

    })
  })

  describe.only('POST /api/event endpoint', () => {
    context('given a user is signed in', () => {
      let creator;

      beforeEach('signin a seeded user', () => {
        const signInBody = makeUser.signinGood()
        return supertest(app)
          .post('/api/auth/signin')
          .send(signInBody)
          .expect(res => {
            creator = res.body
          })
      })

      it('responds with 201 and new event by current user', () => {
        const postBody = makeEvent.postBodyMin()
        return supertest(app)
          .post(`/api/event`)
          .set({
            "Authorization": `Bearer ${creator.token}`
          })
          .send(postBody)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.id).to.not.eql(null)
            expect(res.body).to.have.property('creator_id')
            expect(res.body.creator_id).to.eql(creator.id)
            expect(res.body).to.have.property('title')
            expect(res.body.title).to.eql(postBody.title)
            expect(res.headers.location).to.eql(`/api/event/${res.body.id}`)
            return res
          })
          .then(res => {
            return supertest(app)
              .get(`/api/event/${res.body.id}`)
              .expect(200)
              .expect(res => {
                expect(res.body.creator_id).to.eql(creator.id)
                expect(res.body.title).to.eql(postBody.title)
              })
          })
      })

      const requiredKeys = makeEvent.postBodyMin()
      Object.keys(requiredKeys).forEach(key => {
        it(`responds with 400 if missing required ${key}`, () => {
          const postBodyMin = makeEvent.postBodyMin()
          delete postBodyMin[key]

          if (key == 'creator_id') {
            return supertest(app)
              .post(`/api/event`)
              .set({
                "Authorization": `Bearer ${creator.token}`
              })
              .send(postBodyMin)
              .expect(401, { message: `Must be authorized to post.` })
          }

          return supertest(app)
            .post(`/api/event`)
            .set({
              "Authorization": `Bearer ${creator.token}`
            })
            .send(postBodyMin)
            .expect(400, { message: `${key} is required.`})
        })
      })

      const keysWithLengthLimits = makeEvent.postBodyLongText()
      delete keysWithLengthLimits['creator_id']
      delete keysWithLengthLimits['image_url']
      Object.entries(keysWithLengthLimits).forEach(([key, value]) => {
        const valueLengthLimit = value.length - 1
        it(`responds with 400 if lengths of ${key} text is longer than.. ${valueLengthLimit}`, () => {
          const postBody = {
            ...makeEvent.postBodyMin(),
            [key]: value
          }
          return supertest(app)
            .post(`/api/event`)
            .set({
              "Authorization": `Bearer ${creator.token}`
            })
            .send(postBody)
            .expect(400, { message: `${key} character limit is ${valueLengthLimit}`})
        })

      })

      // it('responds with 400 if child ids (venue, creator_id, band) are invalid', () => {
      //   // build getById controller/services for venue and band
      // })

      it('responds with 401 if user attempts to user anothers creator_id', () => {
        const postBodyNotMyId = makeEvent.postBodyNotMyId()
        return supertest(app)
          .post(`/api/event`)
          .set({
            "Authorization": `Bearer ${creator.token}`
          })
          .send(postBodyNotMyId)
          .expect(401, { message: `Must be authorized to post.`})
      })

      it('responds with 400 if listing_state is not authed enum type', () => {
        const postBodyUnauthedListingState = {
          ...makeEvent.postBodyMin(),
          listing_state: 'Banned'
        }
        return supertest(app)
          .post(`/api/event`)
          .set({
            "Authorization": `Bearer ${creator.token}`
          })
          .send(postBodyUnauthedListingState)
          .expect(400, { message: `Unauthorized listing control.` })
      })

      it('responds with 201 if listing_state is authed but mis-typed', () => {
        const postBodyMisTypedListingState = {
          ...makeEvent.postBodyMin(),
          listing_state: 'private'
        }
        return supertest(app)
          .post(`/api/event`)
          .set({
            "Authorization": `Bearer ${creator.token}`
          })
          .send(postBodyMisTypedListingState)
          .expect(201)
      })



      context('given it is a date related error', () => {
        let pastDate = new Date()
        pastDate = pastDate.setDate(pastDate.getDate() - 1)
        pastDate = new Date(pastDate)
        const dateFields = ["start_date", "end_date"]
        dateFields.forEach(field => {
          it(`responds with 400 if ${field} is before current date`, () => {
            const postBody = {
              ...makeEvent.postBodyMin(),
              [field]: pastDate
            }
              return supertest(app)
                .post('/api/event')
                .set({
                  "Authorization": `Bearer ${creator.token}`
                })
                .send(postBody)
                .expect(400, { message: 'Date cannot be past.' })
          })
        })
      })
    })

    context('given a user is not signed in', () => {
      it('responds with 401', () => {
        const postBody = makeEvent.postBodyMin()
        return supertest(app)
          .post(`/api/event`)
          .send(postBody)
          .expect(401, { message: `Must be authorized to post.`})
      })
    })
  })
})
