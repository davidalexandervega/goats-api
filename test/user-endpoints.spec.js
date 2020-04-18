const app = require('../src/app')
const knex = require('knex')
const {  makeUser } = require('./user-fixtures')
const { seed, truncate } = require('./seed-fixtures')
const UserService = require('../src/services/user-service')

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
        return db.raw(seed.app_user())
      })

      context('given some users have user_state of "Banned", "Archived", or "Private"', () => {
        beforeEach('insert banned and archived users into app_user', () => {
          return db.raw(seed.usersWithBannedOrArchivedState())
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
              expect(res.body[0]).to.not.have.property('modified')
              expect(res.body[0]).to.not.have.property('last_login')
              expect(res.body[0]).to.not.have.property('token')
              expect(res.body[0]).to.not.have.property('password_digest')
            })
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
            let additionalFields = makeUser.patchBody()
            delete additionalFields['username']
            delete additionalFields['password']
            delete additionalFields['email']
            authedUser = res.body
            authedUser = {
              ...authedUser,
              ...additionalFields
            }
            return db('app_user')
              .where({ id: authedUser.id })
              .update({
                ...additionalFields
              })
          })
      })

      beforeEach('signup second test user, insert additional fields', () => {
        const postBody = makeUser.postBody2()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            let additionalFields = makeUser.patchBody()
            delete additionalFields['username']
            delete additionalFields['password']
            delete additionalFields['email']
            otherUser = res.body
            otherUser = {
              ...otherUser,
              ...additionalFields
            }
            return db('app_user')
              .where({ id: otherUser.id })
              .update({
                ...additionalFields
              })
          })
      })

      context('given the user is signed in', () => {
        beforeEach('signin first test user', () => {
          const signInBody = makeUser.signinGood()
          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .then(res => {
              authedUser = res.body
            })

        })

        it('responds with 200 and additional auth fields when user requests their own profile', function() {
          this.retries(3)
          let expected = authedUser
          return supertest(app)
            .get(`/api/user/${authedUser.id}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.id).to.eql(expected.id)
              expect(res.body).to.have.property('username')
              expect(res.body.username).to.eql(expected.username)
              expect(res.body).to.have.property('email')
              expect(res.body.email).to.eql(expected.email)
              expect(res.body).to.have.property('admin')
              expect(res.body.admin).to.eql(expected.admin)
              expect(res.body).to.have.property('image_url')
              expect(res.body.image_url).to.eql(expected.image_url)
              expect(res.body).to.have.property('fullname')
              expect(res.body.fullname).to.eql(expected.fullname)
              expect(res.body).to.have.property('city_name')
              expect(res.body.city_name).to.eql(expected.city_name)
              expect(res.body).to.have.property('region_name')
              expect(res.body.region_name).to.eql(expected.region_name)
              expect(res.body).to.have.property('country_name')
              expect(res.body.country_name).to.eql(expected.country_name)
              expect(res.body).to.have.property('city_id')
              expect(res.body.city_id).to.eql(expected.city_id)
              expect(res.body).to.have.property('user_state')
              expect(res.body.user_state).to.eql(expected.user_state)
              expect(res.body).to.have.property('created')
              expect(res.body).to.have.property('modified')
              expect(res.body).to.have.property('last_login')
              const actualModifiedDate = new Date(res.body.modified).toLocaleString()
              const actualLastLoginDate = new Date(res.body.last_login).toLocaleString()
              const expectedDate = new Date().toLocaleString()
              expect(res.body.created).to.eql(expected.created)
              expect(actualModifiedDate).to.eql(expectedDate)
              expect(actualLastLoginDate).to.eql(expectedDate)
              expect(res.body).to.have.property('token')
              expect(res.body.token).to.not.eql(null)
              expect(res.body).to.not.have.property('password_digest')
              expect(res.body.password_digest).to.eql(undefined)
            })
        })

        it('responds with 200 and public fields when logged in user requests anothers profile', function () {
          const expected = otherUser
          delete expected['email']
          delete expected['fullname']
          delete expected['user_state']
          delete expected['modified']
          delete expected['last_login']
          delete expected['token']

          return supertest(app)
            .get(`/api/user/${otherUser.id}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.id).to.eql(expected.id)
              expect(res.body).to.have.property('username')
              expect(res.body.username).to.eql(expected.username)
              expect(res.body).to.have.property('image_url')
              expect(res.body.image_url).to.eql(expected.image_url)
              expect(res.body).to.not.have.property('email')
              expect(res.body.email).to.eql(undefined)
              expect(res.body).to.not.have.property('fullname')
              expect(res.body.fullname).to.eql(undefined)
              expect(res.body).to.not.have.property('user_state')
              expect(res.body.user_state).to.eql(undefined)
              expect(res.body).to.have.property('created')
              expect(res.body.created).to.eql(expected.created)
              expect(res.body).to.not.have.property('modified')
              expect(res.body.modified).to.eql(undefined)
              expect(res.body).to.not.have.property('last_login')
              expect(res.body.last_login).to.eql(undefined)
              expect(res.body).to.not.have.property('token')
              expect(res.body.token).to.eql(undefined)
              expect(res.body).to.not.have.property('password_digest')
              expect(res.body.password_digest).to.eql(undefined)

              expect(res.body).to.eql(expected)
            })
        })

        it('responds with 404 if user does not exist', () => {
          return supertest(app)
            .get(`/api/user/666`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(404, { error: { message: `User doesn't exist` } })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 401 Unauthorized', () => {
          return supertest(app)
            .get(`/api/user/${otherUser.id}`)
            // .set({
            //   "Authorization": `Bearer ${authedUser.token}`
            // })
            .expect(401, { message: 'Unauthorized.'})
        })
      })
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

        it('responds with 204 and user is updated in db, also new password is hashed', function() {
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
                  return expected.id
                })
                .then(id => {
                  return UserService
                    .getById(db, id)
                    .then(user => {
                      expect(user.password_digest).to.be.a('string')
                      expect(user.password_digest).to.be.length(60)
                    })
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

      context('given the user is attempting to update their username to an existing users', () => {
        it(`responds with 400 if requested username is already in use`, () => {
          const patchBody = {
            username: anotherUser.username
          }
          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(400, { message: `Username ${patchBody.username} is already in use.` })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 401 when missing auth header', () => {
          const patchBody = makeUser.patchBody()
          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .expect(401, { error: { message: 'Not authorized'}})
        })
      })
    })
  })
})
