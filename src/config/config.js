module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DDATABASE_URL || `psql://goats_api:${process.env.DATABASE_PW}@localhost/goats_api`,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || `psql://goats_api:${process.env.DATABASE_PW}@localhost/goats_api_test`
}
