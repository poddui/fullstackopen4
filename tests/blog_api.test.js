const { test, after, describe , beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog');
const api = supertest(app)


const newBlog = {
    title: 'Uusi Blogi',
    author: 'Markku Mäenpää',
    url: 'www.uusiblogi.com',
    likes: 7
  };

describe('Blog API', () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
    });
    test('blogs are returned as JSON', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
    test('returns the correct number of blogs', async () => {
      const initialBlogs = [
        {
          title: 'Testi Blogi',
          author: 'Jukka Metsä',
          url: 'www.testiblogi.fi',
          likes: 3
        },
        {
          title: 'Testi Blogi2',
          author: 'Tuukka Mäki',
          url: 'www.testiblogi.fi/osa2',
          likes: 12
        }
      ];
      await Blog.insertMany(initialBlogs);
      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, initialBlogs.length);
    });
  });

  test('is id name id', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    const blogToCheck = response.body[2];
    assert.strictEqual(blogToCheck.id, savedBlog.body.id);
  });

  test('blog can be added', async () => {
    const original = await api.get('/api/blogs');
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length,  original.body.length + 1);
    const addedBlog = response.body.find(blog => blog.title === newBlog.title);
    assert.strictEqual(addedBlog.title, newBlog.title);
  });

after(async () => {
  await mongoose.connection.close()
})