module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL,
  SEEDS_PATH: process.env.SEEDS_PATH || '/Users/user/code/killeraliens/goats-api/seeds/',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || `psql://goats_api:${process.env.DATABASE_PW}@localhost/goats_api_test`,
  CLIENT_ENDPOINT: process.env.NODE_ENV === "production"
    ? `https://unholygrail.org/`
    : `https://localhost:3000/`
}
