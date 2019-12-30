const app = require('../src/app')
const knex = require('knex')
const { makeUsers, makeUser } = require('./user-fixtures')


describe('Auth endpoints', () => {
  let db
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

