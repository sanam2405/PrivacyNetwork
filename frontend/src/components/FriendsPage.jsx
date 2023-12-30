import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserCard from './UserCard'
import UserBanner from './UserBanner'
import '../styles/FriendsPage.css'

require('dotenv').config()

const PORT = process.env.PORT || 5050
const BASE_API_URI = `http://localhost:${PORT}`

function FriendsPage() {
	const defaultPicLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';
	const navigate = useNavigate()
	const [curruser, setcurrUser] = useState('')
	const [users, setUsers] = useState([])
	const [changePic, setChangePic] = useState(false)

	useEffect(() => {
		fetch(
			`${BASE_API_URI}/api/user/${
				JSON.parse(localStorage.getItem('user'))._id
			}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				},
			},
		)
			.then(res => res.json())
			.then(data => {
				if (data.error) {
					console.log(data.error)
				} else {
					setcurrUser(data.user)
				}
			})
			.catch(err => console.log(err))
	}, [])

	useEffect(() => {
		fetch(`${BASE_API_URI}/api/allusers`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				if (data.error) {
					console.log(data.error)
				} else {
					setUsers(data.users)
				}
			})
			.catch(err => console.log(err))
	}, [])

	const changeProfile = () => {
		setChangePic(!changePic)
	}

	const checker = () => {
		if (localStorage.getItem('user')) {
			return (
				<>
					<div className='user-banner'>
						<UserBanner
							key={curruser.username}
							username={curruser.username} 
							name={curruser.name}
							dpLink={curruser.Photo ? curruser.Photo : defaultPicLink}
						/>
					</div>
					<div className='friends-modal'>
						{users.length > 0 &&
							users.map(user => (
								<UserCard
									key={user.username} // Ensure each UserCard has a unique key
									username={user.username}
									name={user.name}
									dpLink={user.Photo ? user.Photo : defaultPicLink}
									currentUsername={curruser.username}
								/>
							))}
					</div>
				</>
			)
		}
		navigate('/')
	}

	return <div className='friends-container'>{checker()}</div>
}

export default FriendsPage