module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || `psql://goats_api:${process.env.DB_PW}@localhost/goats_api`
}
