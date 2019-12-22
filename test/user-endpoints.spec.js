const app = require('../src/app')
const knex = require('knex')
const { makeUsers, makeUser } = require('./user-fixtures')
const { hashPassword, createToken, checkPassword } = require('../src/utils/token.utils')

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
      beforeEach('insert user into db', () => {
        const testUser = makeUser.good()
        return db
          .insert([testUser])
          .into('app_user')
      })

      it('responds with 200 and requested user', () => {
        const testUser = makeUser.good()
        delete testUser['email']
        delete testUser['password_digest']
        delete testUser['fullname']
        return supertest(app)
          .get(`/api/user/${testUser.id}`)
          .expect(200, testUser)
      })
    })

    context('given user does not exist', () => {
      const testUser = makeUser.good()
      return supertest(app)
        .get(`/api/user/${testUser.id}`)
        .expect(404, { error: { message: `User does not exist` } })
    })
  })

  describe('POST /api/user endpoint', () => {
    context('given the post body is accurate', () => {
      const postBody = makeUser.postBody()
      it('responds with 201 and new user with id', () => {
        const expected = makeUser.postResp()
        const publicRes = makeUser.publicRes()
        return supertest(app)
          .post('/api/user')
          .send(postBody)
          .expect(201)
          .then(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(expected.username)
            expect(res.body.city_id).to.eql(null)
            expect(res.body.admin).to.eql(false)
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`)
            expect(res.body.email).to.eql(expected.email)
            expect(res.body.token).to.not.eql(null)
            return res
          })
          .then(res => {
            return supertest(app)
              .get(`/api/user/${res.body.id}`)
              .expect(200, publicRes)
          })
      })
    })

    context('given there are errors in post body', () => {

    })
  })


})
