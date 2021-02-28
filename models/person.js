const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => { console.log('connected to MongoDB') })
.catch((error) => { console.log('error connecting to MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true, minlength: 3},
	number: {
		validate: {
			validator: function(v) {
				return v.replace(/[^0-9]/g,'').length >= 8
			},
			message: props => `${props.value} does not contain 8 digits!`
		},
		type: String,
		required: true
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)