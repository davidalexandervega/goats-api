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

  let authedCreator;
  before('signup second test user as authed creator', () => {
    const postBody = makeUser.postBody2()
    return supertest(app)
      .post('/api/auth/signup')
      .send(postBody)
      .then(res => {
        authedCreator = res.body
      })
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
    beforeEach('signin authed user', () => {
      const signInBody = makeUser.signinGood()
      return supertest(app)
        .post('/api/auth/signin')
        .send(signInBody)
        .then(res => {
          authedUser = res.body
        })
    })

    context('given there are no flyers in db', () => {
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/flyer')
          .set({
            "Authorization": `Bearer ${authedUser.token}`
          })
          .expect(200, { flyers: [], total: "0" })
      })
    })

    context('given there are flyers', () => {
      beforeEach('insert flyers into flyer', () => {
        return db.raw(seed.flyers())
      })

      context('given some flyers have listing_state of "Banned", "Archived", or "Draft"', () => {
        beforeEach('insert banned and archived flyers into flyer', () => {
          return db.raw(seed.flyersWithBannedOrArchivedState())
        })
        it('responds with 200 and array of flyers without those listing states', () => {
          const expected = makeFlyers()
          return supertest(app)
            .get('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              assert.isObject(res.body)
              expect(res.body).to.have.property('flyers')
              assert.isArray(res.body.flyers)
              expect(res.body.flyers.length).to.equal(4)
              expect(res.body).to.have.property('total')
              expect(res.body.total).to.equal('4')
              expect(res.body.flyers[0]).to.have.property('id')
              expect(res.body.flyers[0]).to.have.property('creator_id')
              expect(res.body.flyers[0]).to.have.property('flyer_type')
              expect(res.body.flyers[0]).to.have.property('image_url')
              expect(res.body.flyers[0]).to.have.property('headline')
              expect(res.body.flyers[0]).to.have.property('bands')
              expect(res.body.flyers[0]).to.have.property('details')
              expect(res.body.flyers[0]).to.have.property('publish_comment')
              expect(res.body.flyers[0]).to.have.property('listing_state')
              expect(res.body.flyers[0]).to.have.property('created')
              expect(res.body.flyers[0]).to.have.property('modified')
              expect(res.body.flyers[0]).to.have.property('creator_username')
              expect(res.body.flyers[0]).to.have.property('creator_image_url')
              expect(res.body.flyers[0]).to.have.property('events')
              expect(res.body.flyers).to.deep.equal(expected)
            })
        })

      })

      context('given the flyers creator (app_user) has a hidden user_state of "Archived", "Banned", or "Private"', () => {
        beforeEach('insert users with "Banned" or "Archived" state', () => {
          return db.raw(seed.usersWithBannedOrArchivedState())
        })
        beforeEach('insert public flyer into flyer with Archived app_user id as creator_id', () => {
          return db.raw(seed.flyersWithBannedOrArchivedCreatorState())
        })

        it('responds with 200 and array of flyers without those of the Archived user', () => {
          const expected = makeFlyers()
          return supertest(app)
            .get('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              assert.isObject(res.body)
              assert.isArray(res.body.flyers)
              expect(res.body.flyers.length).to.equal(4)
              expect(res.body.total).to.equal('4')
              expect(res.body.flyers).to.deep.equal(expected)
            })
        })
      })
    })

    context('given there is xss in a flyers text fields', () => {
      beforeEach('insert flyer with xss into db', () => {
        const flyerWithXss = makeFlyer.withXss()
        return db
          .insert([flyerWithXss])
          .into('flyer')
      })
      it('responds with 200 and array of sanitized flyers', () => {
        const expected = makeFlyer.withSanitizedXss()

        return supertest(app)
          .get(`/api/flyer`)
          .set({
            "Authorization": `Bearer ${authedUser.token}`
          })
          .expect(200)
          .expect(res => {
            assert.isObject(res.body)
            assert.isArray(res.body.flyers)
            expect(res.body.flyers.length).to.equal(1)
            expect(res.body.total).to.equal('1')
            expect(res.body.flyers[0].headline).to.eql(expected.headline)
            expect(res.body.flyers[0].image_url).to.eql(expected.image_url)
            expect(res.body.flyers[0].bands).to.eql(expected.bands)
            expect(res.body.flyers[0].details).to.eql(expected.details)
            expect(res.body.flyers[0].publish_comment).to.eql(expected.publish_comment)
          })
      })
    })

    context('given the request has no token', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get(`/api/flyer`)
          .expect(401, { message: 'Unauthorized.' })
      })
    })

  })

  describe('GET /api/flyer/:id endpoint', () => {
    beforeEach('signin authed user', () => {
      const signInBody = makeUser.signinGood()
      return supertest(app)
        .post('/api/auth/signin')
        .send(signInBody)
        .then(res => {
          authedUser = res.body
        })
    })

    context('given flyer exists', () => {
        beforeEach('insert flyers into flyer', () => {
          return db.raw(seed.flyers())
        })

        it('responds with 200 and flyer', function() {
          const expectedFlyer = makeFlyers()[2]
          return supertest(app)
            .get(`/api/flyer/${expectedFlyer.id}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              assert.isObject(res.body)
              expect(res.body).to.have.property('id')
              expect(res.body).to.have.property('creator_id')
              expect(res.body).to.have.property('flyer_type')
              expect(res.body).to.have.property('image_url')
              expect(res.body).to.have.property('headline')
              expect(res.body).to.have.property('bands')
              expect(res.body).to.have.property('details')
              expect(res.body).to.have.property('publish_comment')
              expect(res.body).to.have.property('listing_state')
              expect(res.body).to.have.property('created')
              expect(res.body).to.have.property('modified')
              expect(res.body).to.have.property('creator_username')
              expect(res.body).to.have.property('creator_image_url')
              expect(res.body).to.have.property('events')
              expect(res.body).to.deep.eql(expectedFlyer)
            })
        })
    })

    context('given flyer does not exist', () => {
      it('responds with 404', () => {
        const nonExistingFlyer = makeFlyers()[2]
        return supertest(app)
          .get(`/api/flyer/${nonExistingFlyer.id}`)
          .set({
            "Authorization": `Bearer ${authedUser.token}`
          })
          .expect(404, { message: 'Flyer does not exist' })
      })
    })

    context('given there is xss in the flyers text fields', () => {
      beforeEach('insert flyer with xss into db', () => {
        const flyerWithXss = makeFlyer.withXss()
        return db
          .insert([flyerWithXss])
          .into('flyer')
      })

      it('responds with 200 and sanitized flyer', () => {
        const expected = makeFlyer.withSanitizedXss()

        return supertest(app)
          .get(`/api/flyer/${expected.id}`)
          .set({
            "Authorization": `Bearer ${authedUser.token}`
          })
          .expect(200)
          .expect(res => {
            assert.isObject(res.body)
            expect(res.body.headline).to.eql(expected.headline)
            expect(res.body.image_url).to.eql(expected.image_url)
            expect(res.body.bands).to.eql(expected.bands)
            expect(res.body.details).to.eql(expected.details)
            expect(res.body.publish_comment).to.eql(expected.publish_comment)
          })
      })
    })

  })

  describe('POST /api/flyer endpoint', () => {
    beforeEach('signin authed creator', () => {
      const signInBody = makeUser.signinGood2()
      return supertest(app)
        .post('/api/auth/signin')
        .send(signInBody)
        .then(res => {
           authedCreator = res.body
        })
    })

    context('given the post body is accurate', () => {
      it('responds with 201 and new flyer with additional events field, creates flyer record in db, fills in default fields', function () {
          const postBody = {
            ...makeFlyer.postBody(),
            creator_id: authedCreator.id
          }
          return supertest(app)
            .post('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .send(postBody)
            .expect(201)
            .expect(res => {
              assert.isObject(res.body)
              console.log(res.body)
              expect(res.headers.location).to.eql(`/api/flyer/${res.body.id}`)
              expect(res.body).to.have.property('id')
              expect(res.body.id).to.be.a.uuid()
              expect(res.body).to.have.property('creator_id')
              expect(res.body.creator_id).to.eql(postBody.creator_id)
              expect(res.body).to.have.property('flyer_type')
              expect(res.body.flyer_type).to.eql(postBody.flyer_type)
              expect(res.body).to.have.property('image_url')
              expect(res.body.image_url).to.eql(postBody.image_url)
              expect(res.body).to.have.property('headline')
              expect(res.body.headline).to.eql(postBody.headline)
              expect(res.body).to.have.property('bands')
              expect(res.body.bands).to.eql(postBody.bands)
              expect(res.body).to.have.property('details')
              expect(res.body.details).to.eql(postBody.details)
              expect(res.body).to.have.property('publish_comment')
              expect(res.body.publish_comment).to.eql(postBody.publish_comment)
              expect(res.body).to.have.property('listing_state')
              expect(res.body.listing_state).to.eql('Public')
              const expectedCreated = new Date(Date.now()).toLocaleString()
              expect(res.body).to.have.property('created')
              expect(new Date(res.body.created).toLocaleString()).to.eql(expectedCreated)
              expect(res.body).to.have.property('modified')
              expect(new Date(res.body.modified).toLocaleString()).to.eql(expectedCreated)
              expect(res.body).to.have.property('events')
              expect(res.body).to.have.property('creator_username')
              expect(res.body.creator_username).to.eql(authedCreator.username)
              expect(res.body).to.have.property('creator_image_url')
              expect(res.body.creator_image_url).to.eql(authedCreator.image_url)
              assert.isArray(res.body.events)
            })
            .then(() => {
              return supertest(app)
                .get('/api/flyer')
                .set({
                  "Authorization": `Bearer ${authedCreator.token}`
                })
                .expect(200)
                .expect(res => {
                  expect(res.body.flyers.length).to.equal(1)
                })
            })
      })

      context('given the events (array) field has events in it', () => {
        it('creates records for all from its events field to the event table, event results are returned in post response with default values updated', () => {
          const postBody = {
            ...makeFlyer.postBody(),
            creator_id: authedCreator.id
          }
          return supertest(app)
            .post('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .send(postBody)
            .expect(201)
            .expect(res => {
              expect(res.body.events.length).to.eql(postBody.events.length)
              assert.isObject(res.body.events[0])
              expect(res.body.events[0]).to.have.property('id')
              expect(res.body.events[0].id).to.be.a.uuid()
              expect(res.body.events[0]).to.have.property('flyer_id')
              expect(res.body.events[0].flyer_id).to.eql(res.body.id)
              expect(res.body.events[0]).to.have.property('event_date')
              expect(res.body.events[0].event_date).to.eql(postBody.events[0].event_date)
              expect(res.body.events[0]).to.have.property('venue_name')
              expect(res.body.events[0].venue_name).to.eql(postBody.events[0].venue_name)
              expect(res.body.events[0]).to.have.property('city_name')
              expect(res.body.events[0].city_name).to.eql(postBody.events[0].city_name)
              expect(res.body.events[0]).to.have.property('region_name')
              expect(res.body.events[0].region_name).to.eql(postBody.events[0].region_name)
              expect(res.body.events[0]).to.have.property('country_name')
              expect(res.body.events[0].country_name).to.eql(postBody.events[0].country_name)
              expect(res.body.events[0]).to.have.property('city_id')
              expect(res.body.events[0].city_id).to.eql(postBody.events[0].city_id)
            })
            .then(() => {
              return supertest(app)
                .get('/api/event')
                .set({
                  "Authorization": `Bearer ${authedCreator.token}`
                })
                .expect(200)
                .expect(res => {
                  expect(res.body.length).to.equal(postBody.events.length)
                })
            })
        })

        context('given there is xss in the flyers events text fields', () => {
          it('responds with 200 and flyer with sanitized events field', () => {
            const postBody = {
              ...makeFlyer.postBodyWithXss(),
              creator_id: authedCreator.id
            }
            const expected = makeFlyer.postBodyWithXssResponseSanitized()
            return supertest(app)
              .post('/api/flyer')
              .set({
                "Authorization": `Bearer ${authedCreator.token}`
              })
              .send(postBody)
              .expect(201)
              .expect(res => {
                expect(res.body.events[0].venue_name).to.eql(expected.events[0].venue_name)
                expect(res.body.events[0].city_name).to.eql(expected.events[0].city_name)
                expect(res.body.events[0].region_name).to.eql(expected.events[0].region_name)
                expect(res.body.events[0].country_name).to.eql(expected.events[0].country_name)
              })
          })
        })

      })

      context('given the events (array) field has no events in it', () => {
        it('the flyer post response returns and empty array for its events field', () => {
          const postBody = {
            ...makeFlyer.postBody(),
            creator_id: authedCreator.id
          }
          postBody["events"] = []
          return supertest(app)
            .post('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .send(postBody)
            .expect(201)
            .expect(res => {
              expect(res.body.events).to.eql([])
            })
        })
      })

      context('given there is xss in the flyers text fields', () => {
        it('responds with 200 and flyer with sanitized text fields', () => {
          const postBody = {
            ...makeFlyer.postBodyWithXss(),
            creator_id: authedCreator.id
          }
          const expected = makeFlyer.postBodyWithXssResponseSanitized()
          return supertest(app)
            .post('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .send(postBody)
            .expect(201)
            .expect(res => {
              expect(res.body.image_url).to.eql(expected.image_url)
              expect(res.body.headline).to.eql(expected.headline)
              expect(res.body.bands).to.eql(expected.bands)
              expect(res.body.details).to.eql(expected.details)
              expect(res.body.publish_comment).to.eql(expected.publish_comment)
            })
        })
      })

    })

    context('given there are errors in the post body', () => {
      const required = ["image_url", "headline", "flyer_type"] // missing "creator_id" throws auth error first

      required.forEach(field => {
        it(`responds with 400 and message if missing required field ${field}`, () => {
          const postBody = {
            ...makeFlyer.postBody(),
            creator_id: authedCreator.id
          }
          delete postBody[field]
          return supertest(app)
            .post('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .send(postBody)
            .expect(400, { message: `${field} is required.` })
        })
      })

      it('responds with 400 if the events field contains something other than an array', () => {
        const postBody = {
          ...makeFlyer.postBody(),
          creator_id: authedCreator.id
        }
        postBody["events"] = "A string!"

        return supertest(app)
          .post('/api/flyer')
          .set({
            "Authorization": `Bearer ${authedCreator.token}`
          })
          .send(postBody)
          .expect(400, { message: `events must be an array.` })
      })

      it('responds with 400 if listing_state is not authed enum type', () => {
        const postBody = {
          ...makeFlyer.postBody(),
          creator_id: authedCreator.id,
          listing_state: 'Banned'
        }
        return supertest(app)
          .post(`/api/flyer`)
          .set({
            "Authorization": `Bearer ${authedCreator.token}`
          })
          .send(postBody)
          .expect(400, { message: `Unauthorized listing control.` })
      })

      context.skip('given the events field contains an event with errors', () => {
        it('responds with 201 but does not post an event if it has no values', () => {
          const postBody = {
            ...makeFlyer.postBody(),
            creator_id: authedCreator.id,
            events: [{}]
          }
          return supertest(app)
            .post('/api/flyer')
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .send(postBody)
            .expect(201)
            .expect(res => {
              expect(res.body.events).to.eql([])
            })
        })

        context.skip('given it is a date related error', () => {
          let pastDate = new Date()
          pastDate = pastDate.setDate(pastDate.getDate() - 1)
          pastDate = new Date(pastDate)
          const dateFields = ["event_date"]
          dateFields.forEach(field => {
            it(`responds with 400 if ${field} is before current date`, () => {
              const postBody = {
                ...makeFlyer.postBody(),
                creator_id: authedCreator.id,
                events: [{ event_date: pastDate }]
              }
              return supertest(app)
                .post('/api/flyer')
                .set({
                  "Authorization": `Bearer ${authedCreator.token}`
                })
                .send(postBody)
                .expect(201)
                .expect(res => {
                  expect(res.body.events).to.eql([])
                })
            })
          })
        })

        it('responds with 201 but does not post an event if its date field is not null and is a past date', () => {
        })
      })

    })
  })

  describe('DELETE /api/flyer/:id endpoint', () => {
    beforeEach('signin authed creator', () => {
      const signInBody = makeUser.signinGood2()
      return supertest(app)
        .post('/api/auth/signin')
        .send(signInBody)
        .then(res => {
          authedCreator = res.body
        })
    })

    context('given the flyer exists', () => {
      let deleteId

      beforeEach('creator post flyer', () => {
        const postBody = {
          ...makeFlyer.postBody(),
          creator_id: authedCreator.id
        }
        return supertest(app)
          .post('/api/flyer')
          .set({
            "Authorization": `Bearer ${authedCreator.token}`
          })
          .send(postBody)
          .expect(201)
          .then(res => {
            deleteId = res.body.id
            return supertest(app)
              .get(`/api/flyer`)
              .set({
                "Authorization": `Bearer ${authedCreator.token}`
              })
              .then(res => {
                expect(res.body.flyers.length).to.eql(1)
                return supertest(app)
                  .get(`/api/event`)
                  .set({
                    "Authorization": `Bearer ${authedCreator.token}`
                  })
                  .expect(res => {
                    expect(res.body.length).to.equal(2)
                  })
              })
          })
      })

      context('given the token user id matches the creator_id', () => {
        it('responds with 204 and removes records of both flyer and related events', () => {
           return supertest(app)
            .delete(`/api/flyer/${deleteId}`)
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .expect(204)
            .then(() => {
              return supertest(app)
                .get(`/api/flyer`)
                .set({
                  "Authorization": `Bearer ${authedCreator.token}`
                })
                .then(res => {
                  expect(res.body.flyers.length).to.eql(0)
                  return supertest(app)
                    .get(`/api/event`)
                    .set({
                      "Authorization": `Bearer ${authedCreator.token}`
                    })
                    .expect(res => {
                      expect(res.body.length).to.equal(0)
                    })
                })
            })
        })
      })

      context('given the token user is not the creator', () => {
        beforeEach('signin authed user', () => {
          const signInBody = makeUser.signinGood()
          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .then(res => {
              authedUser = res.body
            })
        })
        it('responds with 401', () => {
          return supertest(app)
            .delete(`/api/flyer/${deleteId}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(401, { message: 'Unauthorized.'})
            .then(() => {
              return supertest(app)
                .get('/api/flyer')
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(res => expect(res.body.flyers.length).to.equal(1))
            })
        })
      })

      context('given the token user is not the creator, but is admin', () => {
        beforeEach('signin authed user (admin)', () => {
          const signInBody = makeUser.signinGood()
          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .then(res => {
              authedUser = {
                ...res.body,
                admin: true
              }
              return db('app_user')
                .where('id', res.body.id)
                .update('admin', true)
            })
        })
        it('responds with 204 and removes flyer', () => {
          return supertest(app)
            .delete(`/api/flyer/${deleteId}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(204)
            .then(() => {
              return supertest(app)
                .get('/api/flyer')
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(res => expect(res.body.flyers.length).to.equal(0))
            })
        })
      })

    })
  })

  describe.only('PATCH /api/flyer/:id endpoint', () => {
    beforeEach('signin authed creator', () => {
      const signInBody = makeUser.signinGood2()
      return supertest(app)
        .post('/api/auth/signin')
        .send(signInBody)
        .then(res => {
          authedCreator = res.body
        })
    })

    context('given the flyer exists', () => {
      let patchFlyer

      beforeEach('creator post flyer', () => {
        const postBody = {
          ...makeFlyer.postBody(),
          creator_id: authedCreator.id
        }
        return supertest(app)
          .post('/api/flyer')
          .set({
            "Authorization": `Bearer ${authedCreator.token}`
          })
          .send(postBody)
          .expect(201)
          .then(res => {
            patchFlyer = res.body
            return supertest(app)
              .get(`/api/flyer`)
              .set({
                "Authorization": `Bearer ${authedCreator.token}`
              })
              .then(res => {
                expect(res.body.flyers.length).to.eql(1)
                return supertest(app)
                  .get(`/api/event`)
                  .set({
                    "Authorization": `Bearer ${authedCreator.token}`
                  })
                  .expect(res => {
                    expect(res.body.length).to.equal(2)
                  })
              })
          })
      })

      context('given the patch body contains both updated flyer and events fields', () => {
        it('responds with 204, and both flyer and event tables should be updated', () => {
          const patchBody = makeFlyer.patchBody()
          const expected = {
            ...patchFlyer,
            ...patchBody
          }
          return supertest(app)
            .patch(`/api/flyer/${patchFlyer.id}`)
            .send(patchBody)
            .set({
              "Authorization": `Bearer ${authedCreator.token}`
            })
            .expect(204)
            .then(() => {
              return supertest(app)
                .get(`/api/flyer/${patchFlyer.id}`)
                .set({
                  "Authorization": `Bearer ${authedCreator.token}`
                })
                .then(res => {
                  assert.isObject(res.body)
                  expect(res.body).to.have.property('id')
                  expect(res.body.id).to.eql(expected.id)
                  expect(res.body).to.have.property('creator_id')
                  expect(res.body.creator_id).to.eql(expected.creator_id)
                  expect(res.body).to.have.property('flyer_type')
                  expect(res.body.flyer_type).to.eql(expected.flyer_type)
                  expect(res.body).to.have.property('image_url')
                  expect(res.body.image_url).to.eql(expected.image_url)
                  expect(res.body).to.have.property('headline')
                  expect(res.body.image_url).to.eql(expected.image_url)
                  expect(res.body).to.have.property('bands')
                  expect(res.body.bands).to.eql(expected.bands)
                  expect(res.body).to.have.property('details')
                  expect(res.body.details).to.eql(expected.details)
                  expect(res.body).to.have.property('publish_comment')
                  expect(res.body.publish_comment).to.eql(expected.publish_comment)
                  expect(res.body).to.have.property('listing_state')
                  expect(res.body.listing_state).to.eql(expected.listing_state)
                  expect(res.body).to.have.property('created')
                  expect(res.body.created).to.eql(expected.created)
                  expect(res.body).to.have.property('modified')
                  const expectedModified = new Date(Date.now()).toLocaleString()
                  expect(new Date(res.body.modified).toLocaleString()).to.eql(expectedModified)
                  expect(res.body).to.have.property('creator_username')
                  expect(res.body.creator_username).to.eql(expected.creator_username)
                  expect(res.body).to.have.property('creator_image_url')
                  expect(res.body.creator_image_url).to.eql(expected.creator_image_url)
                  expect(res.body).to.have.property('events')
                  expect(res.body.events.length).to.eql(expected.events.length)
                  res.body.events.forEach(event => {
                    expect(event).to.have.property('id')
                    expect(event).to.have.property('flyer_id')
                    expect(event.flyer_id).to.eql(expected.id)
                    expect(event).to.have.property('venue_name')
                    expect(event.venue_name).to.eql(expected.events[0].venue_name) //patchBod is fest (same venue_name for all events)
                  })
                })
            })
        })
      })

    })
  })
})
