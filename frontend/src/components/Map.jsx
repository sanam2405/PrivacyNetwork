import React, { useState, useEffect, useContext } from 'react'

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import io from 'socket.io-client'
import '../styles/Map.css'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../context/LoginContext'

require('dotenv').config()

const socket = io.connect('http://localhost:5050')

const containerStyle = {
	width: '60vw',
	height: '100vh',
}

const center = {
	lat: 22.6405969,
	lng: 88.4145109,
}

function Map() {
	const navigate = useNavigate()

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.GOOGLE_API_KEY,
	})

	const [currentCenter, setCurrentCenter] = useState({
		lat: 22.54905,
		lng: 88.37816,
	})
	const [location, setLocation] = useState({
		lat: 22.54905,
		lng: 88.37816,
	})
	const [locationReceived, setLocationReceived] = useState({
		lat: 22.54905,
		lng: 88.37816,
	})

	const sendLocation = () => {
		console.log('hello i am here...')
		socket.emit('send-location', { location })
	}

	const [locationArray, setLocationArray] = useState([])

	// Demo positions...
	const positions = [
		{ lat: 25.561083, lng: 88.412666 }, // New York
		{ lat: 22.571093, lng: 85.412672 }, // Los Angeles
		{ lat: 21.161083, lng: 87.412 }, // London
	]

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				setCurrentCenter(currentCenter => ({
					...currentCenter,
					lat: position.coords.latitude,
				}))

				setCurrentCenter(currentCenter => ({
					...currentCenter,
					lng: position.coords.longitude,
				}))
				setLocation(location => ({
					...location,
					lat: position.coords.latitude,
				}))

				setLocation(location => ({
					...location,
					lng: position.coords.longitude,
				}))
			})
			socket.on('receive-location', data => {
				console.log('frontend receive...')

				console.log('Current Location : ')
				console.log(location.lat, location.lng)

				console.log('frontend received data : ')

				console.log(data)

				setLocationReceived(location => ({
					...location,
					lat: data.location.lat,
				}))

				setLocationReceived(location => ({
					...location,
					lng: data.location.lng,
				}))

				console.log(locationReceived.lat, locationReceived.lng)

				const newLocationReceived = {
					lat: locationReceived.lat,
					lng: locationReceived.lng,
				}
				console.log('New location received through socket : ')
				console.log(newLocationReceived)
				console.log('Updated array will be : ')
				const newArr = locationArray
				newArr.push(newLocationReceived)
				setLocation(...newArr)
				console.log(locationArray)
			})
		}
	}, [socket])

	const [map, setMap] = React.useState(null)

	const onLoad = React.useCallback(map => {
		const bounds = new window.google.maps.LatLngBounds(center)
		map.fitBounds(bounds)
		setMap(map)
	}, [])

	const onUnmount = React.useCallback(map => {
		setMap(null)
	}, [])

	const distances = [
		{
			value: 0,
			label: '0 km',
		},
		{
			value: 10,
			label: '10',
		},
		{
			value: 20,
			label: '20',
		},
		{
			value: 30,
			label: '30',
		},
		{
			value: 40,
			label: '40',
		},
		{
			value: 50,
			label: '50',
		},
		{
			value: 60,
			label: '60',
		},
		{
			value: 70,
			label: '70',
		},
		{
			value: 80,
			label: '80',
		},
		{
			value: 90,
			label: '90',
		},
		{
			value: 100,
			label: '100 km',
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

	function valuetext(value) {
		return `${value}km`
	}

	const { setModalOpen } = useContext(LoginContext)
	const handleClick = () => {
		setModalOpen(true)
	}

	return isLoaded ? (
		<>
			<div className='complete-container'>
				<div className='map-container'>
					<div>
						<GoogleMap
							mapContainerStyle={containerStyle}
							center={currentCenter}
							zoom={18.25}
						>
							<Marker position={{ lat: location.lat, lng: location.lng }} />
							<Marker
								position={{
									lat: 22.54905,
									lng: 88.37816,
								}}
							/>
							<Marker
								position={{
									lat: 22.559132,
									lng: 88.38827,
								}}
							/>
							{/* {locationArray.map(loc => {
							; <Marker position={{ lat: loc.lat, lng: loc.lng }} />
						})} */}
						</GoogleMap>
					</div>
				</div>
				<div className='option-container'>
					<div className='button-container-2'>
						<Stack direction='row' spacing={25}>
							<Button
								variant='contained'
								size='large'
								onClick={() => {
									navigate('/friendsPage')
								}}
								startIcon={<AccountCircleIcon />}
							>
								Profile
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
					<Box sx={{ width: '27.5rem' }}>
						<Slider
							aria-label='Custom marks'
							defaultValue={20}
							step={10}
							valueLabelDisplay='auto'
							marks={distances}
						/>
					</Box>
					<Box
						component='form'
						sx={{
							'& .MuiTextField-root': {
								m: 1,
								width: '27.5rem',
								marginTop: '4.5rem',
							},
						}}
						noValidate
						autoComplete='off'
					>
						<div>
							<TextField
								required
								id='outlined-number'
								label='Age'
								type='number'
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</div>
					</Box>
					<Box
						component='form'
						sx={{
							'& .MuiTextField-root': {
								m: 1,
								width: '27.5rem',
								marginTop: '4rem',
							},
						}}
						noValidate
						autoComplete='off'
					>
						<div>
							<TextField
								id='outlined-select-gender'
								select
								label='Gender'
								required
								defaultValue='Male'
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
							'& .MuiTextField-root': {
								m: 1,
								width: '27.5rem',
								marginTop: '4rem',
							},
						}}
						noValidate
						autoComplete='off'
					>
						<div>
							<TextField
								id='outlined-select-college'
								select
								label='College'
								required
								defaultValue='Jadavpur University'
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
			</div>
		</>
	) : (
		<></>
	)
}
export default Map
