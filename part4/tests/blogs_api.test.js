const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')



const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog does not have an id field')
  })
})



test('sending a post request to create a new blog', async()=> {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://example.com/new-blog',
    likes: 15
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.deepStrictEqual(response.body.length, initialBlogs.length + 1)
})


test('deleting a blog', async()=>{
  const blogs = await api.get('/api/blogs')
  const blogToDelete = blogs.body[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length - 1) 

})

test('updating a blog', async () => {
  const blogs = await api.get('/api/blogs')
  const blogToUpdate = blogs.body[0]
  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const updatedBlogFromDb = response.body.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogFromDb.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})
