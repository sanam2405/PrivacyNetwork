require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/model')

const { SECRET_KEY } = process.env

module.exports = async (req, res, next) => {
	const { authorization } = req.headers
	if (!authorization) {
		return res.status(401).send({ errors: 'You must have logged in' })
	}
	const token = authorization.replace('Bearer ', '')
	try {
		const info = jwt.verify(token, SECRET_KEY)
		const currUser = await User.findById({ _id: info._id })
		req.user = currUser
		next()
	} catch (error) {
		console.log(error)
		return res.status(401).send({ errors: 'You must have logged in' })
	}
}
