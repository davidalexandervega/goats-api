process.env.TZ = 'UTC'
require('dotenv').config()
const chai = require('chai')
const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest
global.chai = chai
