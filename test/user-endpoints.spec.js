const app = require('../src/app')
const knex = require('knex')
// const { makeUsers, makeUser } = require('./user-fixtures')
const {  makeUser } = require('./user-fixtures')
const { seed, truncate } = require('./seed-fixtures')

describe('User endpoints', () => {
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

  beforeEach('clears app_user and child tables', () => {
    return db.raw(truncate.userChildren())
  })

  afterEach('clears app_user and child tables', () => {
    return db.raw(truncate.userChildren())
  })

  after('clears all tables', () => {
    return db.raw(truncate.allTables())
  })

  after('kill knex db', () => {
    return db.destroy()
  })

  describe('GET /api/user endpoint', () => {

    context('given there are no users in db', () => {
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/api/user')
          .expect(200, [])
      })
    })

    context('given there are users', () => {
      beforeEach('insert users into app_user', () => {
        return db.raw(seed.models())
      })

      it('responds with 200 and array of users without private fields', () => {

        return supertest(app)
          .get('/api/user')
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(4)
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0]).to.have.property('username')
            expect(res.body[0]).to.not.have.property('email')
            expect(res.body[0]).to.have.property('admin')
            expect(res.body[0]).to.have.property('image_url')
            expect(res.body[0]).to.not.have.property('fullname')
            expect(res.body[0]).to.have.property('city_name')
            expect(res.body[0]).to.have.property('region_name')
            expect(res.body[0]).to.have.property('country_name')
            expect(res.body[0]).to.have.property('city_id')
            expect(res.body[0]).to.not.have.property('user_state')
            expect(res.body[0]).to.have.property('created')
            expect(res.body[0]).to.not.have.property('last_login')
            expect(res.body[0]).to.not.have.property('token')
            expect(res.body[0]).to.not.have.property('password_digest')
          })
      })
    })

    context('given there is xss in a users text fields', () => {
      beforeEach('insert user with xss into db', () => {
        const userWithXss = makeUser.withXss()
        return db
          .insert([userWithXss])
          .into('app_user')
      })
      it('responds with 200 and sanitized users', () => {
        const expected = makeUser.withSanitizedXss()

        return supertest(app)
          .get(`/api/user`)
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(1)
            expect(res.body[0].username).to.eql(expected.username)
            expect(res.body[0].image_url).to.eql(expected.image_url)
            expect(res.body[0].city_name).to.eql(expected.city_name)
            expect(res.body[0].region_name).to.eql(expected.region_name)
            expect(res.body[0].country_name).to.eql(expected.country_name)
          })
      })
    })
  })

  describe('GET /api/user/:id', () => {

    context('given user exists', () => {
      let authedUser;
      let otherUser;
      beforeEach('signup test user, insert additional fields', () => {
        const postBody = makeUser.postBody()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            authedUser = res.body
            authedUser = {
              ...authedUser,
              fullname: 'Orlando Garcia',
              city_id: 1392685764,
              email: "killeraliens@outlook.com"
            }
            return db('app_user')
              .where({ id: authedUser.id })
              .update({
                fullname: 'Orlando Garcia',
                city_id: 1392685764,
                email: "killeraliens@outlook.com"
              })
          })
      })
      beforeEach('signup second test user, insert additional fields', () => {
        const postBody = makeUser.postBody2()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            otherUser = res.body
            otherUser = {
              ...otherUser,
              fullname: 'alexandra brinn',
              city_id: 1392685764
            }
            return db('app_user')
              .where({ id: otherUser.id })
              .update({
                fullname: 'alexandra brinn',
                city_id: 1392685764
              })
          })
      })

      context('given the user is signed in', () => {
        beforeEach('signin test user', () => {
          const signInBody = makeUser.signinGood()
          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .expect(res => {
              authedUser = res.body
            })

        })

        it('responds with 200 and additional auth fields when user requests their own profile', function() {
          this.retries(3)
          return supertest(app)
            .get(`/api/user/${authedUser.id}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.id).to.eql(authedUser.id)
              expect(res.body).to.have.property('username')
              expect(res.body.username).to.eql(authedUser.username)
              expect(res.body).to.have.property('email')
              expect(res.body).to.have.property('created')
              expect(res.body).to.have.property('last_login')
              const expectedDate = new Date(Date.now()).toLocaleString()
              const actualDate = new Date(res.body.last_login).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
              expect(res.body).to.have.property('modified')
              expect(res.body).to.have.property('fullname')
              expect(res.body).to.have.property('image_url')
              expect(res.body).to.have.property('token')
              //expect(res.body).to.have.property('facebook_provider_token')
              expect(res.body.password_digest).to.eql(undefined)
              expect(res.body.listing_state).to.eql(undefined)
              expect(res.body).to.eql(authedUser)
            })
        })

        it('responds with 200 and public fields when logged in user requests anothers profile', function () {
          return supertest(app)
            .get(`/api/user/${otherUser.id}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              console.log(`Authed User ${authedUser.id} ${authedUser.username} with token ${authedUser.token}`)
              console.log(`Requested User ${otherUser.id} ${otherUser.username} with token ${otherUser.token}`)
              const expected = otherUser
              delete expected['email']
              delete expected['fullname']
              delete expected['modified']
              delete expected['last_login']
              delete expected['token']
              delete expected['facebook_provider_token']
              delete expected['password_digest']
              delete expected['listing_state']
              console.log(expected)
              console.log(res.body)
              expect(res.body).to.have.property('id')
              expect(res.body.id).to.eql(expected.id)
              expect(res.body).to.have.property('username')
              expect(res.body.username).to.eql(expected.username)
              expect(res.body.email).to.eql(undefined)
              expect(res.body).to.have.property('created')
              expect(res.body.last_login).to.eql(undefined)
              expect(res.body.modified).to.eql(undefined)
              expect(res.body.fullname).to.eql(undefined)
              expect(res.body).to.have.property('image_url')
              expect(res.body.token).to.eql(undefined)
              expect(res.body.facebook_provider_token).to.eql(undefined)
              expect(res.body.password_digest).to.eql(undefined)
              expect(res.body.listing_state).to.eql(undefined)
              expect(res.body).to.eql(expected)

              expect(res.body).to.eql(expected)
            })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 200 and public fields of requested user', () => {
          const expected = authedUser
          delete expected['email']
          delete expected['fullname']
          delete expected['modified']
          delete expected['last_login']
          delete expected['token']
          delete expected['facebook_provider_token']
          delete expected['password_digest']
          delete expected['listing_state']

          return supertest(app)
            .get(`/api/user/${expected.id}`)
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.id).to.eql(expected.id)
              expect(res.body).to.have.property('username')
              expect(res.body.username).to.eql(expected.username)
              expect(res.body.email).to.eql(undefined)
              expect(res.body).to.have.property('created')
              expect(res.body.last_login).to.eql(undefined)
              expect(res.body.modified).to.eql(undefined)
              expect(res.body.fullname).to.eql(undefined)
              expect(res.body).to.have.property('image_url')
              expect(res.body.token).to.eql(undefined)
              expect(res.body.facebook_provider_token).to.eql(undefined)
              expect(res.body.password_digest).to.eql(undefined)
              expect(res.body.listing_state).to.eql(undefined)
              expect(res.body).to.eql(expected)

              expect(res.body).to.eql(expected)
            })
        })
      })
    })

    context('given user does not exist', () => {
      return supertest(app)
        .get(`/api/user/666`)
        .expect(404, { error: { message: `User does not exist` } })
    })
  })

  describe.only('PATCH /api/user/:id endpoint', () => {
    context('given the user exists', () => {
      let authedUser;
      // let authedUserNotModified;
      let anotherUser;
      beforeEach('signup test user', () => {
        const postBody = makeUser.postBody()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            authedUser = res.body
          })
      })

      beforeEach('signup second test user', () => {
        const postBody = makeUser.postBody2()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            anotherUser = res.body
          })
      })

      context('given the user is signed in', () => {
        beforeEach('signin test user', () => {
          const signInBody = makeUser.signinGood()
          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .expect(res => {
              authedUser = res.body
            })
        })

        it('responds with 204 and user is updated in db (not admin level fields)', function() {
          this.retries(3)
          const patchBody = makeUser.patchBody()
          let expectedModified;
          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(204)
            .then(() => {
              expectedModified = Date.now()
              return supertest(app)
                .get(`/api/user/${authedUser.id}`)
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(200)
                .then(res => {
                  const expected = {
                    ...authedUser,
                    ...patchBody,
                    modified: res.body.modified
                  }
                  delete expected['password']
                  expected['admin'] = false
                  expected['user_state'] = 'Public'
                  const actualModified = new Date(res.body.modified).toLocaleString()
                  expectedModified = new Date(authedUser.modified).toLocaleString()
                  expect(actualModified).to.eql(expectedModified)
                  expect(res.body).to.eql(expected)
                })
            })
        })

        it('responds with 400 when no relevant fields are supplied, does not update', function() {
          this.retries(3)
          const patchBody = makeUser.patchBodyMissingField()

          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(400, { message: 'Request body must contain at least one required field'})
            .then(() => {
              return supertest(app)
                .get(`/api/user/${authedUser.id}`)
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(200)
                .then(res => {
                  const expected = {
                    ...authedUser,
                    modified: res.body.modified
                    // ...patchBody
                  }
                  delete expected['password']
                  expected['admin'] = false
                  expected['user_state'] = 'Public'
                  const actualModified = new Date(res.body.modified).toLocaleString()
                  const expectedModified = new Date(authedUser.modified).toLocaleString()
                  expect(actualModified).to.eql(expectedModified)
                  expect(res.body).to.eql(expected)
                })
            })
        })

        it('responds with 401 when sent anothers token', () => {
          const patchBody = makeUser.patchBody()
          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .set({
              "Authorization": `Bearer ${anotherUser.token}`
            })
            .expect(401, { error: { message: 'Not authorized!' } })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 401 when missing auth header', () => {
          const patchBody = makeUser.patchBody()
          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .expect(401, { error: { message: 'Not authorized!'}})
        })
      })
    })
  })
})
