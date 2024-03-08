/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import '../styles/UserCard.css'

const PORT: string | number = import.meta.env.VITE_PORT || 5050
const BASE_API_URI = `http://localhost:${PORT}`

import User from '../types/types'

interface FriendsCardProps {
	username: string
	name: string
	dpLink: string
	currentUsername: string
	user: User
	curruser: User,
	users: User[],
	setUsers: React.Dispatch<React.SetStateAction<User[]>>,
}

function FriendsCard({
	username,
	name,
	dpLink,
	currentUsername,
	user,
	curruser,
	users,
	setUsers,
}: FriendsCardProps) {

	const handleUnFollow = (id:string) => {
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
