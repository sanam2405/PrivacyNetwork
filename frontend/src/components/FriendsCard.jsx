import React from 'react'
import '../styles/UserCard.css'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

require('dotenv').config()

const PORT = process.env.PORT || 5050
const BASE_API_URI = import.meta.env.VITE_BACKEND_URI

function FriendsCard({
	username,
	name,
	dpLink,
	currentUsername,
	user,
	curruser,
	users,
	setUsers,
}) {
	const navigate = useNavigate()

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
				const newUsers = users.filter(u => u._id !== id)
				setUsers(newUsers)
				// setIsFollow(true)
			})
			.catch(err => console.log(err))
	}

	return (
		<>
			{currentUsername !== username &&
			curruser._id !== user._id &&
			curruser.friends.includes(user._id) === true ? (
				<div className='container usercard-container'>
					<div className='card_item'>
						<div className='card_inner'>
							<img src={dpLink} alt='' />
							<div className='Name'>{name}</div>
							<div className='userName'>{username}</div>
							<div className='userUrl' />
							<div className='detail-box'>
								<div className='gitDetail college-field-2'>
									<span>College</span>
									{user.college ? user.college : '〰〰〰'}
								</div>
								<div className='gitDetail'>
									<span>Gender</span>
									{user.gender ? user.gender : '〰〰〰'}
								</div>
								<div className='gitDetail'>
									<span>Age</span>
									{user.age ? user.age : '〰〰〰'}
								</div>
							</div>

							{/* <Button className="top-margin" size="large" variant="contained" onClick={() => handleUnFollow(user._id)}>Remove Friend</Button> */}
							<button
								type='button'
								className='removeFriend'
								onClick={() => handleUnFollow(user._id)}
							>
								Remove Friend
							</button>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}

export default FriendsCard
