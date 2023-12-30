import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import io from 'socket.io-client'

require('dotenv').config()

const socket = io.connect('http://localhost:5050')

const containerStyle = {
	width: '70vw',
	height: '50vh',
}

const center = {
	lat: 22.6405969,
	lng: 88.4145109,
}

function Map() {
	/*
  
  //Room State
  const [room, setRoom] = useState("");
  
  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  
  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);
  
  */

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.GOOGLE_API_KEY,
	})

	const [currentCenter, setCurrentCenter] = useState({
		lat: 25.561083,
		lng: 88.412666,
	})
	const [location, setLocation] = useState({
		lat: 25.561083,
		lng: 88.412666,
	})
	const [locationReceived, setLocationReceived] = useState({
		lat: 25.561083,
		lng: 88.412666,
	})

	const sendLocation = () => {
		console.log('hello i am here...')
		socket.emit('send-location', { location })
	}

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
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={currentCenter}
				zoom={18.25}
			>
				<Marker position={{ lat: location.lat, lng: location.lng }} />
			</GoogleMap>
			<button type='button' onClick={sendLocation}>
				Click Me
			</button>
		</>
	) : (
		<></>
	)
}
export default Map
