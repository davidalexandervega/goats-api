const app = require('../src/app')
const knex = require('knex')
const {  makeFlyer, makeFlyers } = require('./flyer-fixtures')
const { makeUser } = require('./user-fixtures')
const { seed, truncate } = require('./seed-fixtures')
// const chaiJsonPattern = require('chai-json-pattern');
// chai.use(chaiJsonPattern);

describe.only('Flyer endpoints', () => {
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
        return authedUser = res.body
      })
  })

  let authedCreator;
  before('signup second test user as authed creator', () => {
    const postBody = makeUser.postBody2()
    return supertest(app)
      .post('/api/auth/signup')
      .send(postBody)
      .then(res => {
        return authedCreator = res.body
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
          .expect(200, [])
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
              assert.isArray(res.body)
              expect(res.body.length).to.equal(4)
              expect(res.body[0]).to.have.property('id')
              expect(res.body[0]).to.have.property('creator_id')
              expect(res.body[0]).to.have.property('flyer_type')
              expect(res.body[0]).to.have.property('image_url')
              expect(res.body[0]).to.have.property('headline')
              expect(res.body[0]).to.have.property('bands')
              expect(res.body[0]).to.have.property('details')
              expect(res.body[0]).to.have.property('publish_comment')
              expect(res.body[0]).to.have.property('listing_state')
              expect(res.body[0]).to.have.property('created')
              expect(res.body[0]).to.have.property('modified')
              expect(res.body).to.deep.equal(expected)
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
              assert.isArray(res.body)
              expect(res.body.length).to.equal(4)
              expect(res.body).to.deep.equal(expected)
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
            assert.isArray(res.body)
            expect(res.body.length).to.equal(1)
            expect(res.body[0].headline).to.eql(expected.headline)
            expect(res.body[0].image_url).to.eql(expected.image_url)
            expect(res.body[0].bands).to.eql(expected.bands)
            expect(res.body[0].details).to.eql(expected.details)
            expect(res.body[0].publish_comment).to.eql(expected.publish_comment)
          })
      })
    })

    context('given the request has no token', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get(`/api/flyer`)
          .expect(401, { message: 'Unauthorized' })
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
      const postBody = makeFlyer.postBody()
      it('responds with 201 and new flyer, creates record in db, fills in default fields', function () {

      })
    })
  })


  describe.skip('PATCH /api/flyer/:id endpoint', () => {
      // let authedCreator;

      // beforeEach('signup second test user as authed creator', () => {
      //   const postBody = makeUser.postBody2()
      //   return supertest(app)
      //     .post('/api/auth/signup')
      //     .send(postBody)
      //     .then(res => {
      //       anotherUser = res.body
      //     })
      // })

  //       it('responds with 204 and user is updated in db (not admin level fields)', function() {
  //         this.retries(3)
  //         const patchBody = makeUser.patchBody()
  //         let expectedModified;
  //         return supertest(app)
  //           .patch(`/api/user/${authedUser.id}`)
  //           .send(patchBody)
  //           .set({
  //             "Authorization": `Bearer ${authedUser.token}`
  //           })
  //           .expect(204)
  //           .then(() => {
  //             expectedModified = Date.now()
  //             return supertest(app)
  //               .get(`/api/user/${authedUser.id}`)
  //               .set({
  //                 "Authorization": `Bearer ${authedUser.token}`
  //               })
  //               .expect(200)
  //               .then(res => {
  //                 const expected = {
  //                   ...authedUser,
  //                   ...patchBody,
  //                   modified: res.body.modified
  //                 }
  //                 delete expected['password']
  //                 expected['admin'] = false
  //                 expected['user_state'] = 'Public'
  //                 const actualModified = new Date(res.body.modified).toLocaleString()
  //                 expectedModified = new Date(authedUser.modified).toLocaleString()
  //                 expect(actualModified).to.eql(expectedModified)
  //                 expect(res.body).to.eql(expected)
  //               })
  //           })
  //       })

  //       it('responds with 400 when no relevant fields are supplied, does not update', function() {
  //         this.retries(3)
  //         const patchBody = makeUser.patchBodyMissingField()

  //         return supertest(app)
  //           .patch(`/api/user/${authedUser.id}`)
  //           .send(patchBody)
  //           .set({
  //             "Authorization": `Bearer ${authedUser.token}`
  //           })
  //           .expect(400, { message: 'Request body must contain at least one required field'})
  //           .then(() => {
  //             return supertest(app)
  //               .get(`/api/user/${authedUser.id}`)
  //               .set({
  //                 "Authorization": `Bearer ${authedUser.token}`
  //               })
  //               .expect(200)
  //               .then(res => {
  //                 const expected = {
  //                   ...authedUser,
  //                   modified: res.body.modified
  //                   // ...patchBody
  //                 }
  //                 delete expected['password']
  //                 expected['admin'] = false
  //                 expected['user_state'] = 'Public'
  //                 const actualModified = new Date(res.body.modified).toLocaleString()
  //                 const expectedModified = new Date(authedUser.modified).toLocaleString()
  //                 expect(actualModified).to.eql(expectedModified)
  //                 expect(res.body).to.eql(expected)
  //               })
  //           })
  //       })

  //       it('responds with 401 when sent anothers token', () => {
  //         const patchBody = makeUser.patchBody()
  //         return supertest(app)
  //           .patch(`/api/user/${authedUser.id}`)
  //           .send(patchBody)
  //           .set({
  //             "Authorization": `Bearer ${anotherUser.token}`
  //           })
  //           .expect(401, { error: { message: 'Not authorized!' } })
  //       })
  //     })

  //     context('given the user is not signed in', () => {
  //       it('responds with 401 when missing auth header', () => {
  //         const patchBody = makeUser.patchBody()
  //         return supertest(app)
  //           .patch(`/api/user/${authedUser.id}`)
  //           .send(patchBody)
  //           .expect(401, { error: { message: 'Not authorized!'}})
  //       })
  //     })
  //   })
  })
})
