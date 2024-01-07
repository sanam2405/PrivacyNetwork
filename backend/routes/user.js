const express = require('express')

const router = express.Router()
const User = require('../models/model')
const requireLogin = require('../middlewares/requireLogin')

// friend a user
router.put('/follow', requireLogin, async (req, res) => {
	try {
		const toFollow = req.body.userID
		const wantToFollow = req.user._id.toString()

		await User.findByIdAndUpdate(toFollow, {
			$addToSet: { friends: wantToFollow },
		})

		await User.findByIdAndUpdate(wantToFollow, {
			$addToSet: { friends: toFollow },
		})

		return res.status(200).json({ success: true })
	} catch (error) {
		console.log(error)
		res.status(422).json({ error: 'Something went wrong...' })
	}
})

// unfriend a user
router.put('/unfollow', requireLogin, async (req, res) => {
	try {
		const toFollow = req.body.userID
		const wantToFollow = req.user._id.toString()

		await User.findByIdAndUpdate(
			toFollow,
			{
				$pull: { friends: wantToFollow },
			},
			{
				new: true,
			},
		)

		await User.findByIdAndUpdate(
			wantToFollow,
			{
				$pull: { friends: toFollow },
			},
			{
				new: true,
			},
		)

		return res.status(200).json({ success: true })
	} catch (error) {
		console.log(error)
		res.status(422).json({ error: 'Something went wrong...' })
	}
})

// Fetch user details
router.get('/user/:id', requireLogin, async (req, res) => {
	try {
		const { id } = req.params
		const currUser = await User.findOne({ _id: id }).select('-password')
		res.status(200).json({ user: currUser })
	} catch (error) {
		console.log(error)
		res.status(422).json({ error: 'Something went wrong...' })
	}
})

// fetch all users' details
router.get('/allusers', requireLogin, async (req, res) => {
	try {
		const allUsers = await User.find({}).populate(
			'friends',
			'_id name username Photo',
		)
		res.status(200).json({ users: allUsers })
	} catch (error) {
		console.log(error)
		res.status(422).json({ error: 'Something went wrong...' })
	}
})

// save profile picture of users inside mongodb (through cloudinary)
router.put('/uploadProfilePic', requireLogin, async (req, res) => {
	try {
		const userData = await User.findByIdAndUpdate(
			req.user._id,
			{
				$set: { Photo: req.body.pic },
			},
			{
				new: true,
			},
		)
		res.status(200).json({ success: true })
	} catch (error) {
		console.log(error)
		res.status(422).json({ error: 'Something went wrong...' })
	}
})

// posting the age, gender, college properties of an user
router.put('/setProperties', requireLogin, async (req, res) => {
	try {
		const { age, gender, college } = req.body

		if (!age || !gender || !college) {
			return res
				.status(422)
				.json({ error: 'Please fill up all the properties...' })
		}

		console.log(age, gender, college)

		await User.findByIdAndUpdate(
			req.user._id,
			{
				$set: { age },
			},
			{
				new: true,
			},
		)

		await User.findByIdAndUpdate(
			req.user._id,
			{
				$set: { gender },
			},
			{
				new: true,
			},
		)

		await User.findByIdAndUpdate(
			req.user._id,
			{
				$set: { college },
			},
			{
				new: true,
			},
		)

		return res.status(200).json({ success: true })
	} catch (error) {
		console.log(error)
		res.status(422).json({ error: 'Something went wrong...' })
	}
})

module.exports = router
