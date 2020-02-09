process.env.TZ = 'UTC'
require('dotenv').config()
const chai = require('chai')
const { assert, expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.assert = assert
global.supertest = supertest
global.chai = chai
