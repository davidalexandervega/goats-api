const app = require('../src/app')
const knex = require('knex')
const { makeUser } = require('./user-fixtures')
const { seed, truncate } = require('./seed-fixtures')


describe('Auth endpoints', () => {
  let db
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

  before('insert country_city city_id parent data', () => {
    return db.raw(seed.countryCity())
  })

  beforeEach('clears app_user and child tables', () => {
    return db.raw(truncate.userChildren())
  })

  afterEach('clears app_user and child tables', () => {
    return db.raw(truncate.userChildren())
  })

  after('clear all tables', () => {
    return db.raw(truncate.allTables())
  })

  after('kill knex db', () => {
    return db.destroy()
  })

  describe('POST /api/auth/signup endpoint', () => {
    context('given the post body is accurate', () => {
      const postBody = makeUser.postBody()
      it('responds with 201 and new user with id (with additional auth fields)', function() {
        this.retries(3)
        const authedUser = makeUser.postResp()

        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.id).to.eql(authedUser.id)
            expect(res.body.username).to.eql(authedUser.username)
            expect(res.body).to.have.property('email')
            expect(res.body.email).to.eql(authedUser.email)
            expect(res.body).to.have.property('created')
            const expectedCreated = new Date(Date.now()).toLocaleString()
            const actualCreated = new Date(res.body.created).toLocaleString()
            expect(actualCreated).to.eql(expectedCreated)
            expect(res.body).to.have.property('last_login')
            const expectedLastLogin = new Date(Date.now()).toLocaleString()
            const actualLastLogin = new Date(res.body.last_login).toLocaleString()
            expect(actualLastLogin).to.eql(expectedLastLogin)
            expect(res.body).to.have.property('city_id')
            expect(res.body.city_id).to.eql(null)
            expect(res.body).to.have.property('admin')
            expect(res.body.admin).to.eql(false)
            expect(res.body).to.have.property('token')
            expect(res.body.token).to.not.eql(null)
            expect(res.body.password_digest).to.eql(undefined)
            expect(res.body.listing_state).to.eql(undefined)
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
            return res
          })
          .then(res => {
            return supertest(app)
              .get(`/api/user/${res.body.id}`)
              .expect(200)
          })
      })
    })

    context('given there are errors in post body', () => {
      context('given a user with the requested username already exists', () => {
        let existingUser;
        beforeEach('signup test user', () => {
          const postBody = makeUser.postBody()
          return supertest(app)
            .post('/api/auth/signup')
            .send(postBody)
            .then(res => {
              existingUser = res.body
            })
        })

        it(`responds with 400 if requested username is already in use`, () => {
          const postBody = makeUser.postBody()
          return supertest(app)
            .post('/api/auth/signup')
            .send(postBody)
            .expect(400, { message: `Username ${postBody.username} is already in use.`})
        })

      })

    })
  })

  describe('POST /api/auth/signin endpoint', () => {
    context('given the username and password are correct', () => {
      beforeEach('post a new user to match signedInRes', () => {
        const postBody = makeUser.postBody()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            return db('app_user')
              .where({id: res.body.id})
              .update({
                fullname: 'Orlando Garcia',
                city_id: 1392685764,
                email: "killeraliens@outlook.com"
              })
          })
      })

      it('responds with 200 and signed in user (with additional auth fields)', () => {
        const signinBody = makeUser.signinGood()
        const expected = makeUser.signedInRes()

        return supertest(app)
          .post('/api/auth/signin')
          .send(signinBody)
          .expect(200)
          .expect(res => {
            expect(res.body.id).to.eql(expected.id)
            expect(res.body.username).to.eql(expected.username)
            expect(res.body.city_id).to.eql(expected.city_id)
            expect(res.body.admin).to.eql(expected.admin)
            expect(res.body.email).to.eql(expected.email)
            expect(res.body.token).to.not.eql(null)
            const expectedDate = new Date().toLocaleString()
            const actualLastLoginDate = new Date(res.body.last_login).toLocaleString()
            const actualCreatedDate = new Date(res.body.last_login).toLocaleString()
            expect(actualLastLoginDate).to.eql(expectedDate)
            expect(actualCreatedDate).to.eql(expectedDate)
          })

      })
    })

    context('given the user does not exist', () => {
      it('responds with 401', () => {
        const signInBody = makeUser.signinGood()
        return supertest(app)
          .post('/api/auth/signin')
          .send(signInBody)
          .expect(401, { message: `No account with username ${signInBody.username} exists.`})
      })
    })
  })

  describe('GET /api/auth/signout endpoint', () => {
    context('given the user exists', () => {
      let authedUser;

      beforeEach('signup test user', () => {
        const postBody = makeUser.postBody()
        return supertest(app)
          .post('/api/auth/signup')
          .send(postBody)
          .then(res => {
            authedUser = res.body
          })
      })


      context('given the user is signed in', () => {
        const signInBody = makeUser.signinGood()
        it('it responds with 204 and kills the session', () => {

          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .then( res => {
              authedUser = res.body
              //expect(res.status).to.eql(400)
              return supertest(app)
                .get(`/api/auth/signout`)
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(204)
            })
        })
      })

      context('given the user does not have token', () => {
        it('responds with 404', () => {
          return supertest(app)
            .get(`/api/auth/signout`)
            .expect(404)
        })
      })

    })
  })

})

