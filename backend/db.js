require('dotenv').config()
const mongoose = require('mongoose')

const { MONGO_URI } = process.env
mongoose.set('strictQuery', false)

const mongoDB = async () => {
	try {
		await mongoose.connect(MONGO_URI)
		console.log('Connected to Mongo Successful')
		console.log(`Database is located at ${mongoose.connection.host}`)
		console.log(`Database is ported at ${mongoose.connection.port}`)
	} catch (error) {
		console.log(error)
	}
}

module.exports = mongoDB
