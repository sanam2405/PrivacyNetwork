import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded'
import UserCard from './UserCard'
import UserBanner from './UserBanner'
import '../styles/FriendsPage.css'

require('dotenv').config()

const PORT = process.env.PORT || 5050
const BASE_API_URI = `http://localhost:${PORT}`

function FriendsPage() {
	const defaultPicLink =
		'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'
	const navigate = useNavigate()
	const [curruser, setcurrUser] = useState('')
	const [users, setUsers] = useState([])
	const [changePic, setChangePic] = useState(false)

	const colleges = [
		{
			value: 'Jadavpur University',
			label: 'Jadavpur University',
		},
		{
			value: 'Calcutta University',
			label: 'Calcutta University',
		},
		{
			value: 'Presidency University',
			label: 'Presidency University',
		},
		{
			value: 'Kalyani University',
			label: 'Kalyani University',
		},
	]

	const genders = [
		{
			value: 'Male',
			label: 'Male',
		},
		{
			value: 'Female',
			label: 'Female',
		},
		{
			value: 'Non Binary',
			label: 'Non Binary',
		},
	]

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
					<div className='container'>
						<div className='button-container'>
							<Button
								variant='outlined'
								onClick={() => {
									navigate('/client')
								}}
								startIcon={<TravelExploreRoundedIcon />}
							>
								Go To Map
							</Button>
						</div>
						<div className='user-banner'>
							<UserBanner
								key={curruser.username}
								username={curruser.username}
								name={curruser.name}
								dpLink={curruser.Photo ? curruser.Photo : defaultPicLink}
							/>
						</div>
						<div className='option-container'>
							<div className='form-container'>
								<Box
									component='form'
									sx={{
										'& .MuiTextField-root': { m: 1, width: '25ch' },
									}}
									noValidate
									autoComplete='off'
								>
									<div>
										<TextField
											required
											id='outlined-number'
											label='Required'
											type='number'
											InputLabelProps={{
												shrink: true,
											}}
											helperText='Please select your age'
										/>
									</div>
								</Box>

								<Box
									component='form'
									sx={{
										'& .MuiTextField-root': { m: 1, width: '25ch' },
									}}
									noValidate
									autoComplete='off'
								>
									<div>
										<TextField
											id='outlined-select-gender'
											select
											label='Required'
											required
											defaultValue='Male'
											helperText='Please select your gender'
										>
											{genders.map(option => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem>
											))}
										</TextField>
									</div>
								</Box>

								<Box
									component='form'
									sx={{
										'& .MuiTextField-root': { m: 1, width: '25ch' },
									}}
									noValidate
									autoComplete='off'
								>
									<div>
										<TextField
											id='outlined-select-college'
											select
											label='Required'
											required
											defaultValue='Jadavpur University'
											helperText='Please select your college'
										>
											{colleges.map(option => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem>
											))}
										</TextField>
									</div>
								</Box>
							</div>
							<div className='checkbox-container'>
								<FormGroup>
									<FormControlLabel
										control={<Checkbox defaultChecked />}
										label='Show my visibility'
									/>
								</FormGroup>
							</div>
							<Stack direction='row' spacing={3}>
								<Button variant='outlined' startIcon={<PeopleAltRoundedIcon />}>
									My Friends
								</Button>
								<Button variant='contained' endIcon={<GroupAddRoundedIcon />}>
									Add Friends
								</Button>
							</Stack>
						</div>

						{/* <div className='friends-modal'>
						{users.length > 0 &&
							users.map(user => (
								<UserCard
									key={user.username} // Ensure each UserCard has a unique key
									username={user.username}
									name={user.name}
									dpLink={user.Photo ? user.Photo : defaultPicLink}
									currentUserName={curruser.username}
									user={user}
									curruser={curruser}
								/>
							))}
					</div> */}
					</div>
				</>
			)
		}
		navigate('/')
	}

	return <div className='friends-container'>{checker()}</div>
}

export default FriendsPage
