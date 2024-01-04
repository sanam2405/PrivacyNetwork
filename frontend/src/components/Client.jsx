import React from 'react'
import { useNavigate } from 'react-router-dom'
import Map from './Map'

function Client() {
	const navigate = useNavigate()

	const checker = () => {
		if (localStorage.getItem('user') !== null) {
			;<Map />
		} else {
			navigate('/login')
		}
	}

	return <div>{checker()}</div>
}

export default Client
