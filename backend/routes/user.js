const express = require('express')

const router = express.Router()
const User = require('../models/model')
const requireLogin = require('../middlewares/requireLogin')

// friend a user
router.put('/follow', requireLogin, async (req, res) => {
	try {
		const toFollow = req.body.userID
		const wantToFollow = req.user._id

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
		const toFollow = req.body.userID // ayush
		const wantToFollow = req.user._id // anumoy

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

module.exports = router
