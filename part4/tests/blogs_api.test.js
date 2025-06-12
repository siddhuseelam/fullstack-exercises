const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')



const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'https://example.com/first-blog',
    likes: 5
  },
  {
    title: 'Second Blog',
    author: 'Jane Doe',
    url: 'https://example.com/second-blog',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
after(async () => {
  await mongoose.connection.close()
})
