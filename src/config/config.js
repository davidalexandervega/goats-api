module.exports = {
  PORT: process.env.PORT || 8000,
  HOST: process.env.HOST || "http://localhost", 
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:  process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || `psql://${process.env.DATABASE_USER}:${process.env.DATABASE_PW}@${process.env.DATABASE_HOST}/${process.env.TEST_DATABASE_NAME}`,
  DATABASE_CONNECT: {
      user: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PW,
      database: process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_NAME : process.env.DATABASE_NAME,
      port: 5432,
      host: process.env.DATABASE_HOST || "localhost",
      ssl: process.env.NODE_ENV === "production"
  },
  SEEDS_PATH: process.env.SEEDS_PATH || '/Users/user/code/killeraliens/goats-api/seeds/',
  CLIENT_ENDPOINT: process.env.NODE_ENV === "production"
    ? `https://unholygrail.org/`
    : `http://localhost:3000/`,
}
