require('dotenv').config()

module.exports = {
    "migrationPattern": "migrations/*",
    "driver": "pg",
    "host": process.env.DATABASE_HOST ?? "127.0.0.1",
    "port": 5432,
    "database": process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_NAME 
      : process.env.DATABASE_NAME,
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PW
}