const app = require('../src/app')
const knex = require('knex')
const { makeUsers, makeUser } = require('./user-fixtures')

describe('User endpoints', () => {
  let db;
  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clears city country app_user tables', () => {
    return db.raw('TRUNCATE city, country, app_user')
  })

  before('insert country_city city_id FK', () => {
    return db.raw(`
      COPY country(country_name, country_code)
      FROM '/Users/user/code/killeraliens/goats-api/seeds/countries.csv' DELIMITER ',' CSV HEADER;

      INSERT INTO country
        (country_name, country_code)
      VALUES
        ('West Bank', 'XW'),
        ('Kosovo', 'XK');

      COPY city(city_name,city_ascii,lat,lng,country,country_code,iso3,admin_name,capital,population,id)
      FROM '/Users/user/code/killeraliens/goats-api/seeds/worldcities.csv'
      DELIMITER ',' CSV HEADER;
    `)
  })

  beforeEach('clears app_user table', () => {
    return db.truncate('app_user')
  })

  afterEach('clears app_user table', () => {
    return db.truncate('app_user')
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
      const testUsers = makeUsers();
      beforeEach('insert users into app_user', () => {
        return db
          .insert(testUsers)
          .into('app_user')
      })

      it('responds with 200 and array of users without private fields', () => {
        const expectedUser = testUsers[0]
        delete expectedUser['email']
        delete expectedUser['password_digest']
        delete expectedUser['token']
        delete expectedUser['fullname']

        return supertest(app)
          .get('/api/user')
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(2)
            expect(res.body[0]).to.eql(expectedUser)
          })
      })
    })

    context('given there is xss in a username', () => {
      beforeEach('insert user with xss into db', () => {
        const userWithXss = makeUser.withXss()
        return db
          .insert([userWithXss])
          .into('app_user')
      })
      it('responds with 200 and sanitized users', () => {
        const expected = makeUser.withSanitizedXss()
        delete expected['email']
        delete expected['password_digest']
        delete expected['fullname']
        return supertest(app)
          .get(`/api/user`)
          .expect(200)
          .expect(res => {
            expect(res.body[0]).to.eql(expected)
          })
      })
    })
  })

  describe('GET /api/user/:id', () => {

    context('given user exists', () => {
      let authedUser;

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

      context('given the user is signed in', () => {
        const signInBody = makeUser.signinGood()

        it('responds with 200 and requested user (with additional auth fields)', () => {
          const expected = authedUser;
          delete expected['password_digest']
          // delete expected['token']

          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .expect(res => {
              authedUser = res.body
              return supertest(app)
                .get(`/api/user/${authedUser.id}`)
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(200, expected)
            })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 200 and requested user', () => {
          const expected = makeUser.good()
          delete expected['email']
          delete expected['password_digest']
          delete expected['fullname']

          return supertest(app)
            .get(`/api/user/${expected.id}`)
            .expect(200, expected)
        })
      })
    })

    context('given user does not exist', () => {
      const expected = makeUser.good()
      return supertest(app)
        .get(`/api/user/${expected.id}`)
        .expect(404, { error: { message: `User does not exist` } })
    })
  })

  describe('PATCH /api/user/:id endpoint', () => {
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
        it('responds with 204 and user is updated in db', () => {
          const signInBody = makeUser.signinGood()
          const patchBody = makeUser.patchBody()

          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .then(res => {
              authedUser = res.body

              return supertest(app)
                .patch(`/api/user/${authedUser.id}`)
                .send(patchBody)
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(204)
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
                        ...patchBody
                      }
                      delete expected.password
                      expected.admin = false

                      expect(res.body).to.eql(expected)
                    })
                })
            })
        })

        it('responds with 400 when no relevant fields are supplied', () => {
          const signInBody = makeUser.signinGood()
          const patchBody = makeUser.patchBodyMissingField()


          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .then(res => {
              authedUser = res.body

              return supertest(app)
                .patch(`/api/user/${authedUser.id}`)
                .send(patchBody)
                .set({
                  "Authorization": `Bearer ${authedUser.token}`
                })
                .expect(400)
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
                        // ...patchBody
                      }
                      delete expected.password
                      expected.admin = false

                      expect(res.body).to.eql(expected)
                    })
                })
            })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 401', () => {
          const patchBody = makeUser.patchBody()
          // patchBody.token = authedUser.token
          //console.log('patch body', patchBody)
          return supertest(app)
            .patch(`/api/user/${authedUser.id}`)
            .send(patchBody)
            .expect(401, { error: { message: 'must be authenticated'}})
        })
      })

    })
  })

})
