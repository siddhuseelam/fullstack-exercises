console.log('server started');


const express = require('express');
const { request } = require('http');
const morgan = require('morgan');

const cors = require('cors')


const app = express()

app.use(morgan('tiny'))

app.use(cors())


app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.static('dist')); // Move this after the root route


app.get('/api/persons',(request,response) =>{
    console.log('request received');
    
    response.json(persons)
})


app.get('/info',(request,response) =>{
    
    const length = persons.length
    const time = new Date().toString()

    response.send(
        `<p>Phonebook has info for ${length} people</p>
        <p>${time}</p>`
    );
})


app.get('/api/persons/:id',(request,response) =>{
    const id = request.params.id
    const person = persons.find((p) => p.id === id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.post('/api/persons',(request,response)=>{
    let person = request.body
    console.log(person)
    
    
    if(!person.name){
        return response.status(400).json({error:'name-missing'})
    }
    if(!person.number){
        return response.status(400).json({error:'number-missing'})
    }
    if(persons.find(p => p.name === person.name)){
        return response.status(400).json({error:'name-already-exists'})
    }


    const p = {
        name: person.name,
        number: person.number|| 0,
        id:  Math.floor(Math.random() * 10000).toString(),
    }

    persons = persons.concat(p)
    response.json(p)
})


const PORT = process.env.PORT || 3001
app.listen(
    PORT,()=>{
    console.log(`app running on the port ${PORT}`);

})
