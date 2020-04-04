process.env.TZ = 'UTC'

require('dotenv').config()
const chai = require('chai')
const { assert, expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.assert = assert
global.supertest = supertest
global.chai = chai

console.log("use `npm run test` to pass integration tests with 'development' environment")
console.log("use `npm run test-node-env` to pass unit tests requiring 'test' environment")
