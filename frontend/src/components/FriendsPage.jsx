import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded'

import UserCard from './UserCard'
import FriendsCard from './FriendsCard'
import UserBanner from './UserBanner'
import '../styles/FriendsPage.css'
import { LoginContext } from '../context/LoginContext'

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

	const { setModalOpen } = useContext(LoginContext)
	const handleClick = () => {
		setModalOpen(true)
	}

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

	// Modal custom stylesheet
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		minWidth: '60vw',
		maxWidth: '95vw',
		maxHeight: '80vh',
		bgcolor: '#f0f0f0',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		borderRadius: 5,
		overflow: 'auto',
	}

	// Closed Modal Icon stylesheet
	const closeButtonStyle = {
		position: 'absolute',
		top: 5,
		right: 5,
		fontWeight: 'bolder',
	}

	// Modal related hooks and utilities
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const [open2, setOpen2] = useState(false)
	const handleOpen2 = () => setOpen2(true)
	const handleClose2 = () => setOpen2(false)

	const [toggle, setToggle] = useState(false)

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
					{/* actual content of the screen  */}
					<div className='container'>
						<div className='button-container'>
							<Stack direction='row' spacing={3}>
								<Button
									variant='contained'
									size='large'
									onClick={() => {
										navigate('/client')
									}}
									startIcon={<TravelExploreRoundedIcon />}
								>
									Go To Map
								</Button>
								<Button
									variant='outlined'
									size='large'
									color='success'
									onClick={handleClick}
									endIcon={<ExitToAppRoundedIcon />}
								>
									Logout
								</Button>
							</Stack>
						</div>
						<div className='user-banner'>
							<UserBanner
								key={curruser.username}
								username={curruser.username}
								name={curruser.name}
								dpLink={curruser.Photo ? curruser.Photo : defaultPicLink}
							/>
						</div>
						<div className='options-container'>
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
							<div className='save-edit-button-container'>
								<Stack direction='row' spacing={3}>
									{!toggle && (
										<Button
											variant='contained'
											onClick={() => {
												setToggle(!toggle)
											}}
											startIcon={<SaveRoundedIcon />}
										>
											Save
										</Button>
									)}
									{toggle && (
										<Button
											variant='outlined'
											onClick={() => {
												setToggle(!toggle)
											}}
											startIcon={<SaveAsRoundedIcon />}
										>
											Edit
										</Button>
									)}
								</Stack>
							</div>
							<Stack direction='row' spacing={5}>
								<Button
									variant='outlined'
									size='large'
									onClick={handleOpen2}
									startIcon={<PeopleAltRoundedIcon />}
								>
									My Friends
								</Button>
								<Button
									variant='contained'
									size='large'
									onClick={handleOpen}
									endIcon={<GroupAddRoundedIcon />}
								>
									Add Friends
								</Button>
							</Stack>
						</div>
					</div>
					{/* Show friends modal  */}
					<div className='modal-container'>
						<Modal
							aria-labelledby='transition-modal-title'
							aria-describedby='transition-modal-description'
							open={open}
							onClose={handleClose}
							closeAfterTransition
							slots={{ backdrop: Backdrop }}
							slotProps={{
								backdrop: {
									timeout: 500,
								},
							}}
						>
							<Fade in={open}>
								<Box sx={style}>
									<IconButton
										aria-label='close'
										style={closeButtonStyle}
										onClick={handleClose}
									>
										<CloseIcon />
									</IconButton>
									<div className='friends-modal'>
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
													users={users}
													setUsers={setUsers}
												/>
											))}
									</div>
								</Box>
							</Fade>
						</Modal>
					</div>
					{/* Add friends modal  */}
					<div className='modal-container'>
						<Modal
							aria-labelledby='transition-modal-title'
							aria-describedby='transition-modal-description'
							open={open2}
							onClose={handleClose2}
							closeAfterTransition
							slots={{ backdrop: Backdrop }}
							slotProps={{
								backdrop: {
									timeout: 500,
								},
							}}
						>
							<Fade in={open2}>
								<Box sx={style}>
									<IconButton
										aria-label='close'
										style={closeButtonStyle}
										onClick={handleClose2}
									>
										<CloseIcon />
									</IconButton>
									<div className='friends-modal'>
										{users.length > 0 &&
											users.map(user => (
												<FriendsCard
													key={user.username} // Ensure each FriendsCard has a unique key
													username={user.username}
													name={user.name}
													dpLink={user.Photo ? user.Photo : defaultPicLink}
													currentUserName={curruser.username}
													user={user}
													curruser={curruser}
													users={users}
													setUsers={setUsers}
												/>
											))}
									</div>
								</Box>
							</Fade>
						</Modal>
					</div>
				</>
			)
		}
		navigate('/login')
	}

	return <div className='friends-container'>{checker()}</div>
}

export default FriendsPage
