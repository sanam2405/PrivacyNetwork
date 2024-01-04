import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import io from 'socket.io-client'
import '../styles/Map.css'

require('dotenv').config()

const socket = io.connect('http://localhost:5050')

const containerStyle = {
	width: '70vw',
	height: '100vh',
}

const center = {
	lat: 22.6405969,
	lng: 88.4145109,
}

function Map() {
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

	return isLoaded ? (
		<>
			<div className='map-container'>
				<div>
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={currentCenter}
						zoom={18.25}
					>
						<Marker position={{ lat: location.lat, lng: location.lng }} />
						{/* <Marker position={{
                            lat: 22.549152,
                            lng: 88.378260,
                        }} /> */}
						{/* <Marker position={{
                            lat: 22.559132,
                            lng: 88.388270,
                        }} /> */}
						{locationArray.map(loc => {
							;<Marker position={{ lat: loc.lat, lng: loc.lng }} />
						})}
					</GoogleMap>
				</div>
				<div className='button-container'>
					<button
						type='button'
						className='enlarge-button'
						onClick={sendLocation}
					>
						Click Me
					</button>
				</div>
			</div>
		</>
	) : (
		<></>
	)
}
export default Map
