const blogsRouter = require('express').Router();
const { response } = require('express');
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


blogsRouter.get('/', async (request,response) =>{
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  console.log('Received request body:', request.body)
  console.log('Authorization header:', request.get('authorization'))

  const body = request.body

  const token = getTokenFrom(request)
  console.log('Extracted token:', token)

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log('Decoded token:', decodedToken)
  
  if (!decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }


  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: decodedToken.id
  })

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
  const { title, author, url, likes, user } = request.body

  const updatedBlog = {
    title,
    author,
    url,
    likes,
    user
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    updatedBlog,
    { new: true, runValidators: true }
  ).populate('user', { username: 1, name: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


module.exports = blogsRouter;