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
    url: 'www.uusiblogi.com'
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
    assert.strictEqual(addedBlog.likes, 0)  // Tarkastetaan että tykkäykset on 0 vaikka uudessa blogissa ei niitä anneta
  });


  test('blog without title is not added', async () => {
    const original = await api.get('/api/blogs');
    const newBlog = {
      author: 'Kari Kivi',
      url: 'www.blogi.fi'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, original.body.length)
  })

  test('blog without url is not added', async () => {
    const original = await api.get('/api/blogs');
    const newBlog = {
      title: 'Testi Blogi',
      author: 'Roope Puu'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, original.body.length)
  })

  test('blog can be deleted by id', async () => {
    const original = await api.get('/api/blogs');
    const blogToDelete = original.body[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, original.body.length - 1)
    const deteledBlog = response.body.find(blog => blog.id === blogToDelete.id)
    assert.strictEqual(deteledBlog, undefined)
  })

  test('blogs likes can be modified', async () => {
    const original = await api.get('/api/blogs')
    const blogToUpdate = original.body[0]
    const updatedBlog = {
      likes: blogToUpdate.likes + 5
    }
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 5)
  })

after(async () => {
  await mongoose.connection.close()
})