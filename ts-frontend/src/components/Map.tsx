/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState, useContext } from 'react'

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
// import { io, Socket } from "socket.io-client";
import '../styles/Map.css'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../context/LoginContext'
// import { Socket } from 'socket.io'

// please note that the types are reversed
// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

// const socket = io.connect('http://localhost:5050')

const containerStyle = {
	width: '60vw',
	height: '100vh',
}

function Map() {
	const navigate = useNavigate()
	const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

	if (!apiKey) throw new Error('GOOGLE_API_KEY environment variable is not set')

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: apiKey,
	})

	const [currentCenter] = useState({
		lat: 22.54905,
		lng: 88.37816,
	})
	const [location] = useState({
		lat: 22.54905,
		lng: 88.37816,
	})
	// const [locationReceived, setLocationReceived] = useState({
	// 	lat: 22.54905,
	// 	lng: 88.37816,
	// })

	const [age, setAge] = useState(0)
	const [gender, setGender] = useState('Male')
	const [college, setCollege] = useState('Jadavpur University')
	const [sliderValue, setSliderValue] = useState(50)

	const handleAgeChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const inputValue = parseFloat(event.target.value)
		const newAge = inputValue <= 0 || inputValue > 125 ? 1 : inputValue
		setAge(newAge)
	}
	const handleGenderChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setGender(event.target.value)
	}
	const handleCollegeChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setCollege(event.target.value)
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSliderChange = (event: any) => {
		setSliderValue(event?.target?.value)
	}

	// const sendLocation = () => {
	// 	console.log('hello i am here...')
	// 	socket.emit('send-location', { location })
	// }

	// const [locationArray, setLocationArray] = useState([])

	// useEffect(() => {
	// 	if (navigator.geolocation) {
	// 		navigator.geolocation.getCurrentPosition(position => {
	// 			setCurrentCenter(currentCenter => ({
	// 				...currentCenter,
	// 				lat: position.coords.latitude,
	// 			}))

	// 			setCurrentCenter(currentCenter => ({
	// 				...currentCenter,
	// 				lng: position.coords.longitude,
	// 			}))
	// 			setLocation(location => ({
	// 				...location,
	// 				lat: position.coords.latitude,
	// 			}))

	// 			setLocation(location => ({
	// 				...location,
	// 				lng: position.coords.longitude,
	// 			}))
	// 		})
	// 		socket.on('receive-location', data => {
	// 			console.log('frontend receive...')

	// 			console.log('Current Location : ')
	// 			console.log(location.lat, location.lng)

	// 			console.log('frontend received data : ')

	// 			console.log(data)

	// 			setLocationReceived(location => ({
	// 				...location,
	// 				lat: data.location.lat,
	// 			}))

	// 			setLocationReceived(location => ({
	// 				...location,
	// 				lng: data.location.lng,
	// 			}))

	// 			console.log(locationReceived.lat, locationReceived.lng)

	// 			const newLocationReceived = {
	// 				lat: locationReceived.lat,
	// 				lng: locationReceived.lng,
	// 			}
	// 			console.log('New location received through socket : ')
	// 			console.log(newLocationReceived)
	// 			console.log('Updated array will be : ')
	// 			const newArr = locationArray
	// 			newArr.push(newLocationReceived)
	// 			setLocation(...newArr)
	// 			console.log(locationArray)
	// 		})
	// 	}
	// }, [socket])

	// const [map, setMap] = React.useState(null)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// const onLoad = React.useCallback((map: any) => {
	// 	const bounds = new window.google.maps.LatLngBounds(center)
	// 	map.fitBounds(bounds)
	// 	setMap(map)
	// }, [])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// const onUnmount = React.useCallback((map: any) => {
	// 	setMap(null)
	// }, [])

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

	// function valuetext(value) {
	// 	return `${value}km`
	// }

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
							{/* Current Location  */}
							<Marker position={{ lat: location.lat, lng: location.lng }} />
							{college === 'Jadavpur University' &&
								gender === 'Male' &&
								sliderValue >= 50 && (
									<Marker position={{ lat: 22.4965, lng: 88.3698 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Male' &&
								sliderValue >= 40 && (
									<Marker position={{ lat: 22.5726, lng: 88.3639 }} />
								)}
							{college === 'Presidency University' &&
								gender === 'Male' &&
								sliderValue >= 30 && (
									<Marker position={{ lat: 22.5752, lng: 88.3686 }} />
								)}
							{college === 'Kalyani University' &&
								gender === 'Male' &&
								sliderValue >= 40 && (
									<Marker position={{ lat: 22.9769, lng: 88.4348 }} />
								)}
							{college === 'Jadavpur University' &&
								gender === 'Female' &&
								sliderValue >= 30 && (
									<Marker position={{ lat: 22.4269, lng: 87.51 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Female' &&
								sliderValue >= 70 && (
									<Marker position={{ lat: 23.1725, lng: 88.8624 }} />
								)}
							{college === 'Presidency University' &&
								gender === 'Female' &&
								sliderValue >= 60 && (
									<Marker position={{ lat: 22.8765, lng: 88.1234 }} />
								)}
							{college === 'Kalyani University' &&
								gender === 'Female' &&
								sliderValue >= 20 && (
									<Marker position={{ lat: 23.5665, lng: 88.0012 }} />
								)}
							{college === 'Jadavpur University' &&
								gender === 'Male' &&
								sliderValue >= 20 && (
									<Marker position={{ lat: 22.4021, lng: 88.2327 }} />
								)}
							{college === 'Presidency University' &&
								gender === 'Male' &&
								sliderValue >= 80 && (
									<Marker position={{ lat: 22.2725, lng: 87.8723 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Male' &&
								sliderValue >= 50 && (
									<Marker position={{ lat: 23.5991, lng: 87.7623 }} />
								)}
							{college === 'Kalyani University' &&
								gender === 'Male' &&
								sliderValue >= 10 && (
									<Marker position={{ lat: 22.2756, lng: 88.0001 }} />
								)}
							{college === 'Jadavpur University' &&
								gender === 'Female' &&
								sliderValue >= 60 && (
									<Marker position={{ lat: 23.2345, lng: 88.78 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Female' &&
								sliderValue >= 40 && (
									<Marker position={{ lat: 23.5232, lng: 87.6763 }} />
								)}
							{college === 'Presidency University' &&
								gender === 'Female' &&
								sliderValue >= 30 && (
									<Marker position={{ lat: 22.6232, lng: 88.7455 }} />
								)}
							{college === 'Kalyani University' &&
								gender === 'Female' &&
								sliderValue >= 40 && (
									<Marker position={{ lat: 22.4569, lng: 87.7232 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Female' &&
								sliderValue >= 70 && (
									<Marker position={{ lat: 22.7256, lng: 88.9924 }} />
								)}
							{college === 'Jadavpur University' &&
								gender === 'Male' &&
								sliderValue >= 20 && (
									<Marker position={{ lat: 22.5765, lng: 87.5555 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Male' &&
								sliderValue >= 40 && (
									<Marker position={{ lat: 22.1329, lng: 88.5013 }} />
								)}
							{college === 'Presidency University' &&
								gender === 'Male' &&
								sliderValue >= 70 && (
									<Marker position={{ lat: 22.4021, lng: 88.2327 }} />
								)}
							{college === 'Kalyani University' &&
								gender === 'Male' &&
								sliderValue >= 50 && (
									<Marker position={{ lat: 23.0001, lng: 88.0001 }} />
								)}
							{college === 'Jadavpur University' &&
								gender === 'Female' &&
								sliderValue >= 40 && (
									<Marker position={{ lat: 22.3725, lng: 87.8624 }} />
								)}
							{college === 'Calcutta University' &&
								gender === 'Female' &&
								sliderValue >= 20 && (
									<Marker position={{ lat: 22.3725, lng: 87.8624 }} />
								)}
							{college === 'Presidency University' &&
								gender === 'Female' &&
								sliderValue >= 90 && (
									<Marker position={{ lat: 22.5667, lng: 88.1234 }} />
								)}
							{college === 'Kalyani University' &&
								gender === 'Female' &&
								sliderValue >= 50 && (
									<Marker position={{ lat: 23.5665, lng: 88.5463 }} />
								)}
							{college === 'Jadavpur University' &&
								gender === 'Male' &&
								sliderValue >= 60 && (
									<Marker position={{ lat: 22.4022, lng: 88.7327 }} />
								)}
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
							step={10}
							valueLabelDisplay='auto'
							marks={distances}
							value={sliderValue}
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							onChange={(e: any) => handleSliderChange(e)}
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
								value={age}
								onChange={e => handleAgeChange(e)}
								InputProps={{
									inputProps: { min: 1, max: 125 },
								}}
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
								value={gender}
								onChange={e => handleGenderChange(e)}
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
								value={college}
								onChange={e => handleCollegeChange(e)}
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
