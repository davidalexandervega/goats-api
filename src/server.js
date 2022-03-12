const app = require('./app')
const { PORT, DATABASE_URL, NODE_ENV, HOST } = require('./config/config')
const knex = require('knex')
const db = knex({
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL,
    ssl: NODE_ENV === "production" ? ({ rejectUnauthorized: false }) : false
  }
})

app.set('db', db)
app.listen(PORT, () => {
  console.log(`Server listening at ${HOST}:${PORT}`)
})
