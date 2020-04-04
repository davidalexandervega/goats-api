process.env.TZ = 'UTC'

require('dotenv').config()
const chai = require('chai')
const { assert, expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.assert = assert
global.supertest = supertest
global.chai = chai

console.log("use `npm run test` to pass all tests, esp those mocks requiring 'test' environment")
console.log("use `npm run test-env-dev` to see which tests are using mock/sandbox interactions (these will fail)")
