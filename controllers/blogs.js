const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogsRouter = express.Router()

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});


blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

  if(!title || !url){
    return response.status(400).json({error: 'Title and url are required'})
  }

  const users = await User.find({});
  if (!users) {
    return response.status(400).json({ error: 'User not found' });
  }

  const randomUser = users[Math.floor(Math.random() * users.length)];
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0 ,
    user: randomUser._id
  })
  const savedBlog = await blog.save()
  randomUser.blogs = randomUser.blogs.concat(savedBlog._id);
  await randomUser.save();
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  })

  blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  })


module.exports = blogsRouter
