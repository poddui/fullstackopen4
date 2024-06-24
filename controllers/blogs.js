const express = require('express')
const Blog = require('../models/blog')

const blogsRouter = express.Router()

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body
  if(!title || !url){
    return response.status(400).json({error: 'Title and url are required'})
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0 
  })
  const savedBlog = await blog.save()
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
