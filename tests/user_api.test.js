const { test, after, describe , beforeEach} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/user_helper');
const mongoose = require('mongoose')


const newUser = {
    username: 'nallukka',
    name: 'Teemu Palomaa',
    password: 'testisalis123'
  };

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
    await mongoose.connection.close(); // Close mongoose connection after tests
  });
