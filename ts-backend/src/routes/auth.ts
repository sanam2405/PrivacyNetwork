require('dotenv').config()
import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/models'
const SECRET_KEY = process.env.SECRET_KEY

const authRouter = express.Router()

authRouter.use(express.json())

authRouter.post(
	'/signup',
	[
		body('email', 'Email is not properly formatted').isEmail(),
		body('username', 'Username is too short').isLength({ min: 5 }),
		body('password', 'Password is too short, choose something strong').isLength(
			{ min: 5 },
		),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(432).json({ errors: errors.array() })
		}

		const { name, username, email, password } = req.body
		if (!name || !username || !email || !password) {
			return res.status(422).json({ error: 'Please add all the fields...' })
		}
		try {
			const savedUser = await User.findOne({
				$or: [{ email }, { username }],
			})
			if (savedUser) {
				return res
					.status(422)
					.json({ error: 'A user already exists with the email or username' })
			}
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password, salt)
			const user = new User({
				name,
				username,
				email,
				password: hashedPassword,
			})
			await user.save()
			res.status(200).json({ success: true })
		} catch (err) {
			console.log(err)
			res.status(400).json({ success: false })
		}
	},
)

authRouter.post(
	'/login',
	[
		body('email', 'Email is not properly formatted').isEmail(),
		body('password', 'Password is too short, choose something strong').isLength(
			{ min: 5 },
		),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(432).json({ errors: errors.array() })
		}

		const { email, password } = req.body
		if (!email || !password) {
			return res.status(422).json({ error: 'Please add all the fields...' })
		}
		if (!SECRET_KEY) {
			console.error('SECRET_KEY is undefined. Check the .env')
			return res.status(500).send({ errors: 'Internal Server Error' })
		}
		try {
			const userData = await User.findOne({ email })
			if (userData) {
				const hashedPassword = userData.password
				const isMatch = await bcrypt.compare(password, hashedPassword)
				if (isMatch) {
					const jwtToken = jwt.sign({ _id: userData.id }, SECRET_KEY)
					return res.status(200).json({
						success: true,
						username: userData.username,
						token: jwtToken,
						user: userData,
					})
				}
				return res.status(422).json({
					error: 'Your entered password does not match, please try again...',
				})
			}
			return res
				.status(422)
				.json({ error: 'No user exists with this email...' })
		} catch (err) {
			console.log(err)
			res.status(400).json({ success: false })
		}
	},
)

authRouter.post('/googleLogin', async (req: Request, res: Response) => {
	if (!SECRET_KEY) {
		console.error('SECRET_KEY is undefined. Check the .env')
		return res.status(500).send({ errors: 'Internal Server Error' })
	}
	try {
		const { emailVerified, email, name, clientId, username, Photo } = req.body
		if (emailVerified) {
			const userData = await User.findOne({ email })
			if (userData) {
				const jwtToken = jwt.sign({ _id: userData.id }, SECRET_KEY)
				return res.status(200).json({
					success: true,
					username: userData.username,
					token: jwtToken,
					user: userData,
				})
			}

			const password = email + clientId
			const user = new User({
				name,
				username,
				email,
				password,
				Photo,
			})
			await user.save()
			const jwtToken = jwt.sign({ _id: user.id }, SECRET_KEY)
			return res.status(200).json({
				success: true,
				username: user.username,
				token: jwtToken,
				user,
			})
		}
		return res
			.status(400)
			.json({ success: false, message: 'Email not verified by Google' })
	} catch (error) {
		console.log(error)
		res.status(400).json({ success: false })
	}
})

export default authRouter