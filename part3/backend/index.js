console.log('server started');

require('dotenv').config()
const mongoose = require('mongoose')


const Person = require('./modules/person.js')


const express = require('express');
const { request } = require('http');
const morgan = require('morgan');

const cors = require('cors');
const { error } = require('console');


const app = express()

app.use(morgan('tiny'))

app.use(cors())


app.use(express.json())


app.use(express.static('dist')); // Move this after the root route


app.get('/api/persons',(request,response) =>{
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => {
        console.error('Error fetching persons:', error);
        response.status(500).send('Internal Server Error');
    });
})


app.get('/info',(request,response) =>{
    
    Person.find({}).then(persons =>{
        response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toString()}</p>`
    )
    })

    
})


app.get('/api/persons/:id',(request,response) =>{
    const id = request.params.id
    Person.findById(id)
    .then(person => {
        if(person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.error('Error fetching person:', error);
        response.status(500).send('Internal Server Error');
    })
})


app.delete('/api/persons/:id',(request,response,next) =>{
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(() => {
        response.status(204).end()
    })
    .catch(error => {
        next(error)
    })
})


app.post('/api/persons', (request, response, next) => {
    let person = request.body
    console.log(person)

    
    const newPerson = new Person({
        name: person.name,
        number: person.number,
    })

    newPerson.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => {
        next(error)
    })
    
    
    
})


app.put('/api/persons/:id',(request,response,next) =>{
    const {name,number} = request.body

    Person.findById(request.params.id)
    .then(existingPerson => {
        if (!existingPerson) {
            return response.status(404).send({ error: 'Person not found' });
        }
        
        existingPerson.name = name
        existingPerson.number = number

        return existingPerson.save().then(savedPerson => {
            response.json(savedPerson);
        })
    .catch(error => {
        next(error);
    })
}
)
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

// This line registers the error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(
    PORT,()=>{
    console.log(`app running on the port ${PORT}`);

})
