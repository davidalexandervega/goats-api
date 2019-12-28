const app = require('../src/app')
const knex = require('knex')
const { makeUsers, makeUser } = require('./user-fixtures')
makeUser.good()
describe('User endpoints', () => {
  let db;
  before('create knex db instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clears app_user and related tables', () => {
    return db.raw(`
      TRUNCATE city, country, app_user, venue, event, band, band_event
      RESTART IDENTITY CASCADE
    `)
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

  beforeEach('clears app_user and child tables', () => {
    return db.raw(`
      TRUNCATE app_user, venue, event, band, band_event RESTART IDENTITY CASCADE
    `)
  })

  afterEach('clears app_user and child tables', () => {
    return db.raw(`
      TRUNCATE app_user, venue, event, band, band_event RESTART IDENTITY CASCADE
    `)
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
        delete expectedUser['modified']
        delete expectedUser['last_login']

        return supertest(app)
          .get('/api/user')
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(2)
            expect(res.body[0]).to.have.property('created')
            expect(delete res.body[0].created).to.eql(delete expectedUser.created)
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
            expect(res.body.length).to.equal(1)
            expect(res.body[0]).to.have.property('created')
            expect(delete res.body[0].created).to.eql(delete expected.created)
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
        beforeEach('signin test user', () => {
          const signInBody = makeUser.signinGood()
          return supertest(app)
            .post('/api/auth/signin')
            .send(signInBody)
            .expect(res => {
              authedUser = res.body
            })

        })

        it('responds with 200 and requested user (with additional auth fields)', () => {
          return supertest(app)
            .get(`/api/user/${authedUser.id}`)
            .set({
              "Authorization": `Bearer ${authedUser.token}`
            })
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body).to.have.property('email')
              expect(res.body).to.have.property('created')
              expect(res.body).to.have.property('last_login')
              expect(res.body).to.have.property('modified')
              expect(res.body).to.have.property('fullname')
              expect(res.body).to.have.property('token')
              //expect(res.body).to.have.property('facebook_auth_token')
              expect(res.body.password_digest).to.eql(undefined)
              expect(res.body).to.eql(authedUser)
            })
        })
      })

      context('given the user is not signed in', () => {
        it('responds with 200 and requested user', () => {
          const expected = makeUser.good()
          delete expected['email']
          delete expected['fullname']
          delete expected['modified']
          delete expected['last_login']

          return supertest(app)
            .get(`/api/user/${expected.id}`)
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('created')
              delete res.body['created']
              delete expected['created']
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

  describe('PATCH /api/user/:id endpoint', () => {
    context('given the user exists', () => {
      let authedUser;
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

        it('responds with 204 and user is updated in db', function() {
          this.retries(3)
          const patchBody = makeUser.patchBody()
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
                  delete expected['password']
                  expected['admin'] = false

                  const expectedDate = new Date().toLocaleString()
                  const actualDate = new Date(res.body.modified).toLocaleString()
                  expect(actualDate).to.eql(expectedDate)
                  expect(res.body).to.eql(expected)
                })
            })
        })

        it('responds with 400 when no relevant fields are supplied, does not update', () => {
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
                    // ...patchBody
                  }
                  delete expected['password']
                  expected['admin'] = false
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
