import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Signup from './components/Signup'
import Login from './components/Login'
import FriendsPage from './components/FriendsPage'
import Client from './components/Client'
import LogoutModal from './components/LogoutModal'
import { LoginContext } from './context/LoginContext'

require('dotenv').config()

const { GOOGLE_CLIENT } = process.env

function App() {
	const [userLogin, setUserLogin] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<div className='App'>
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
				<LoginContext.Provider
					value={{ setUserLogin, setModalOpen, userLogin }}
				>
					<BrowserRouter>
						<Routes>
							<Route path='/' element={<Signup />} />
							<Route path='/login' element={<Login />} />
							<Route path='/friendsPage' element={<FriendsPage />} />
							<Route path='/client' element={<Client />} />
						</Routes>
					</BrowserRouter>
					{modalOpen ? <LogoutModal /> : ''}
				</LoginContext.Provider>
			</GoogleOAuthProvider>
		</div>
	)
}

export default App
