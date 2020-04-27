module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || `psql://goats_api:${process.env.DATABASE_PW}@localhost/goats_api`,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || `psql://goats_api:${process.env.DATABASE_PW}@localhost/goats_api_test`,
  CLIENT_ENDPOINT: process.env.NODE_ENV === "production"
    // ? `https://unholygrail.org/`
    ? `https://goatsguide.com/`
    : `https://localhost:3000/`
}
