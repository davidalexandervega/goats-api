const app = require('./app')
const { PORT, DATABASE_CONNECT } = require('./config/config')
const knex = require('knex')
const db = knex({
  client: 'pg',
  connection: DATABASE_CONNECT
})

app.set('db', db)
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
