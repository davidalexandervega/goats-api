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


  describe('POST /api/auth/signin endpoint', () => {
    context('given the username and password are correct', () => {
      beforeEach('post new user', () => {
        const postBody = makeUser.postBody()
        return supertest(app)
          .post('/api/user')
          .send(postBody)
          .then(res => {
            return db
              .where('id', res.body.id)
              .from('app_user')
              .update({ city_id: 1392685764})
          })
      })

      it('responds with 200 and signed in user', () => {
        const signinBody = makeUser.signinGood()
        const expected = makeUser.signedInRes()


        return supertest(app)
          .post('/api/auth/signin')
          .send(signinBody)
          .expect(200, expected)

      })
    })
  })
})
