import React from 'react'
import '../styles/UserCard.css'
import { useNavigate } from 'react-router-dom'

require('dotenv').config()

const PORT = process.env.PORT || 5050
const BASE_API_URI = `http://localhost:${PORT}`

function UserCard({ username, name, dpLink, currentUsername, user, curruser }) {
	const navigate = useNavigate()

	const handleFollow = id => {
		fetch(`${BASE_API_URI}/api/follow`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
			},
			body: JSON.stringify({
				userID: id,
			}),
		})
			.then(res => res.json())
			.then(result => {
				console.log(result)
				// setIsFollow(false)
			})
			.catch(err => console.log(err))
	}

	const handleUnFollow = id => {
		fetch(`${BASE_API_URI}/api/unfollow`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
			},
			body: JSON.stringify({
				userID: id,
			}),
		})
			.then(res => res.json())
			.then(result => {
				console.log(result)
				// setIsFollow(true)
			})
			.catch(err => console.log(err))
	}

	return (
		<>
			{currentUsername !== username &&
			curruser.friends.includes(user._id) === false ? (
				<div className='container'>
					<div className='card_item'>
						<div className='card_inner'>
							<img src={dpLink} alt='' />
							<div className='Name'>{name}</div>
							<div className='userName'>{username}</div>
							<div className='userUrl' />
							<div className='detail-box'>
								<div className='gitDetail'>
									<span>College</span>JU
								</div>
								<div className='gitDetail'>
									<span>Following</span>45
								</div>
								<div className='gitDetail'>
									<span>Followers</span>11
								</div>
							</div>
							<button
								type='button'
								className='addFriend'
								onClick={() => handleFollow(user._id)}
							>
								Add Friend
							</button>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}

export default UserCard
