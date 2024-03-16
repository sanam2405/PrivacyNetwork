require('dotenv').config()
import mongoose from 'mongoose'

const MONGO_URI: string | undefined = process.env.MONGO_URI

mongoose.set('strictQuery', false)

const mongoDB = async () => {
	try {
		if (!MONGO_URI) {
			console.error('MONGO_URI is undefined. Check the .env ')
			return
		}
		await mongoose.connect(MONGO_URI)
		console.log('Connected to Mongo Successful')
		console.log(`Database is located at ${mongoose.connection.host}`)
		console.log(`Database is ported at ${mongoose.connection.port}`)
	} catch (error) {
		console.log(error)
	}
}

export default mongoDB
