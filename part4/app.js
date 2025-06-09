const express = require('express')
const mongoose = require('mongoose')
const config  = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })







app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app