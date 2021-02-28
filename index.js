const express = require('express')
var morgan = require('morgan')
const app = express()


app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let Persons =  [
	{
		name: "Arto Hellas",
		number: "321",
		id: 1
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4
	}
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
	res.json(Persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = Persons.find(person => person.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	Persons = Persons.filter(person => person.id !== id)
  
	response.status(204).end()
})

const generateId = () => {
	const ids = Persons.map(i => i.id);

	while (true)
	{
		const id = Math.floor(Math.random() * 1000)
		if (!ids.includes(id))
			return id;		
	}	
}
  
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

	if (Persons.map(i => i.name).includes(body.name)) {
		return response.status(400).json({ 
			error: 'Name already exists' 
		})
	}

  
	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}
  
	Persons = Persons.concat(person)
  
	response.json(person)
})

app.get('/api/info', (request, response) => {
	response.end(`Phonebook has info for ${Persons.length} people.\n\n${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
