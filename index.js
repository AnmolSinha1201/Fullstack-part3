require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(person => {
		if (person) { 
			response.json(note)
		} else { 
			response.status(404).end()
		}
		response.json(person)
	}).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
	Person.findByIdAndRemove(request.params.id)
    .then(result => {
		response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
  
	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, note, { new: true })
		.then(updatedNote => {
			response.json(updatedNote)
		})
		.catch(error => next(error))
})
  
app.post('/api/persons', (request, response) => {
	const body = request.body
  
	if (!body.name) {
		return response.status(400).json({ 
			error: 'Name missing' 
		})
	}

	if (!body.number) {
		return response.status(400).json({ 
			error: 'Number missing' 
		})
	}

  
	const person = new Person({
		name: body.name,
		number: body.number,
	});
  
	person.save().then(savedPerson => {
		response.json(savedPerson)
	});
})

app.get('/api/info', (request, response) => {
	response.end(`Phonebook has info for ${Persons.length} people.\n\n${new Date()}`)
})


const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} 

	next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
