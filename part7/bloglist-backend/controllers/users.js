const usersRouter = require('express').Router();
const bcrypt = require('bcrypt')
const { response } = require('express');
const User = require('../models/user')
const Blog = require('../models/blog')


usersRouter.post('/', async(request,response) =>{
    const {username,name,password} = request.body
    const saltRounds = 10

    if (password.length < 3) {
        return response.status(400).json({error: 'password must be at least 3 characters long'})
    }

    const passwordHash = await  bcrypt.hash(password,saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)


})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  const result = await Promise.all(users.map(async user => {
    const blogs = await Blog.find({ user: user._id }).select({ title: 1, author: 1, url: 1, id: 1 })
    return {
      id: user._id,
      name: user.name,
      blogs: blogs
    }
  }))
  response.json(result)
})

module.exports = usersRouter;