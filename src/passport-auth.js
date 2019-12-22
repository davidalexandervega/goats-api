// const passport = require('passport');
// const { DB_URL } = require('./config/config')
// const knex = require('knex')
// const db = knex({
//   client: 'pg',
//   connection: DB_URL
// })

// module.exports = () => {

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {

//     db('app_user').where({ id }).first()
//       .then((user) => { done(null, user); })
//       .catch((err) => { done(err, null); });
//   });

// };
