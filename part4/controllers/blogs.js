const blogsRouter = require('express').Router();
const { response } = require('express');
const Blog = require('../models/blog')


blogsRouter.get('/', async (request,response) =>{
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

   const savedBlog = await blog.save()
   response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog = request.body

  const blog = await Blog.findByIdAndUpdate(id,updatedBlog)
  response.status(200).json(blog)
})


module.exports = blogsRouter;