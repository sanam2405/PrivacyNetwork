require('dotenv').config()
import jwt from 'jsonwebtoken'
import User from '../models/models'
import { Request, Response, NextFunction } from 'express'
import HttpStatusCode from '../types/HttpStatusCode'

interface TokenPayload {
	_id: string
}

const requireLogin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(HttpStatusCode.UNAUTHORIZED).send({ errors: 'You must be logged in' })
	}

	const token = authorization.replace('Bearer ', '')

	try {
		if (!process.env.SECRET_KEY) {
			console.error('SECRET_KEY is undefined. Check the .env')
			return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ errors: 'Internal Server Error' })
		}

		const info = jwt.verify(token, process.env.SECRET_KEY) as TokenPayload
		const currUser = await User.findById(info._id)

		if (!currUser) {
			return res.status(HttpStatusCode.NOT_FOUND).send({ errors: 'User not found' })
		}

		interface CustomRequest extends Request {
			user?: typeof currUser
		}

		;(req as CustomRequest).user = currUser

		next()
	} catch (error) {
		console.error(error)
		return res.status(HttpStatusCode.UNAUTHORIZED).send({ errors: 'You must be logged in' })
	}
}

export default requireLogin
