// Write your tests here
const request = require('supertest')
const server = require('../api/server')
const db = require('../data/dbConfig')
const VALID_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6IkFyY3RpY2l2ZSIsImlhdCI6MTcwMzU1Nzk2OCwiZXhwIjoxNzAzNjQ0MzY4fQ.iCTM92l5vLZ9yBGLyqzHjL8lI5pzTMoI763IgTpS3Sg'

test('sanity', () => {
  expect(true).not.toBe(false)
})

describe('Server testing', () => {
  beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
  })
  beforeEach(async () => {
    await db.seed.run()
  })
  describe('/api/auth endpoints are functioning', () => {
    test('[POST] /register registers new user on valid payload', async () => {
      let expected = { id: 2, username: 'John-Knee', password: 'waffle' }
      let input_url = '/api/auth/register'
      let input_data = { username: 'John-Knee', password: 'waffle' }
      let res = await request(server).post(input_url).send(input_data)
      expect(res.body).toMatchObject({ ...expected, password: res.body.password })
      expect(res.status).toBe(201)
    })
    test('[POST] /register throws error on invalid payload', async () => {
      let expected = 'username and password required'
      let input_url = '/api/auth/register'
      let input_data = { username: '', password: '' }
      let res = await request(server).post(input_url).send(input_data)
      expect(res.body.message).toBe(expected)
      expect(res.status).toBe(400)
    })
    test('[POST] /login logins in user on valid payload', async () => {
      let expected = { message: `welcome, Arcticive`, token: 'some_token' }
      let input_url = '/api/auth/login'
      let input_data = { username: 'Arcticive', password: 'waffle' }
      let res = await request(server).post(input_url).send(input_data)
      expect(res.body).toMatchObject({ ...expected, token: res.body.token })
      expect(res.status).toBe(200)
    })
    test('[POST] /login throws error on invalid login info payload', async () => {
      let expected = 'invalid credentials'
      let input_url = '/api/auth/login'
      let input_data = { username: 'Account', password: 'mypassword' }
      let res = await request(server).post(input_url).send(input_data)
      expect(res.body.message).toBe(expected)
      expect(res.status).toBe(400)
    })
  })
  describe('/api/jokes endpoints are functioning', () => {
    test('[GET] / returns jokes on valid jwt check', async () => {
      let expected = {
        id: "0189hNRf2g",
        joke: "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      }
      let input_url = '/api/jokes'
      let res = await request(server).get(input_url).set('Authorization', VALID_JWT)
      expect(res.body[0]).toMatchObject(expected)
      expect(res.status).toBe(200)
    })
    test('[GET] / throws error if invalid jwt is supplied', async () => {
      let expected = 'token invalid'
      let input_url = '/api/jokes'
      let res = await request(server).get(input_url).set('Authorization', 'disvalidpls')
      expect(res.body.message).toBe(expected)
      expect(res.status).toBe(401)
    })
  })
})
