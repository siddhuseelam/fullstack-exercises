const express = require('express')
const mongoose = require('mongoose')
const config  = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

const app = express()


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB:', error.message)
    })







app.use(express.json())

app.use('/api/blogs', blogsRouter)


module.exports = app