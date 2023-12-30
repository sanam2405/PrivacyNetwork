import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GoogleLogin } from '@react-oauth/google'
import '../styles/Signup_Login.css'
import { jwtDecode } from 'jwt-decode'
import { LoginContext } from '../context/LoginContext'
import logo from '../../public/images/sign-up.png'

require('dotenv').config()

const PORT = process.env.PORT || 5050
const BASE_API_URI = `http://localhost:${PORT}`

function Signup() {
	const [credentials, setCredentials] = useState({
		email: '',
		name: '',
		username: '',
		password: '',
	})
	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const notifyA = str => toast.success(str)
	const notifyB = str => toast.error(str)

	const navigate = useNavigate()
	const { setUserLogin } = useContext(LoginContext)

	const inputEvent = event => {
		const { name } = event.target
		const { value } = event.target
		setCredentials({ ...credentials, [name]: value })
	}

	// wildcard expression.....
	const strongPassword = new RegExp(
		'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})',
	)

	const postData = async event => {
		event.preventDefault()
		if (!strongPassword.test(credentials.password)) {
			notifyB(
				'Your password is not strong enough !!! Strong password must be of length 5 atleast, containing atleast one lowercase, uppercase, special character, and numeric digits',
			)
		} else {
			try {
				const response = await fetch(`${BASE_API_URI}/api/signup`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: credentials.name,
						username: credentials.username,
						email: credentials.email,
						password: credentials.password,
					}),
				})

				const { status } = response

				const jsonData = await response.json()

				if (status === 200) {
					notifyA('Sign up successful')
					setTimeout(() => {
						navigate('/login')
					}, 4000)
				} else if (status === 432) {
					notifyB(`${jsonData.errors[0].msg}`)
					// alert(jsonData.errors[0].msg);
				} else if (status === 422) {
					notifyB(`${jsonData.error}`)
					// alert(jsonData.error);
				} else {
					notifyB('Oops !!! enter valid credentials')
					// alert("Enter Valid Credentials.....");
				}
			} catch (error) {
				console.log(error)
				notifyB('Oops !!! enter valid credentials')
				// alert("Enter valid credentials...");
			}
		}
	}

	const continueWithGoogle = async credentialResponse => {
		try {
			console.log(credentialResponse)
			const jwtDetail = jwtDecode(credentialResponse.credential)
			console.log(jwtDetail)
			const response = await fetch(`${BASE_API_URI}/api/googleLogin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					emailVerified: jwtDetail.emailVerified,
					email: jwtDetail.email,
					name: jwtDetail.name,
					clientId: credentialResponse.clientId,
					username: jwtDetail.name,
					Photo: jwtDetail.picture,
				}),
			})
			const { status } = response

			const jsonData = await response.json()

			if (status === 200) {
				notifyA(`Welcome ${jsonData.username}`)
				setUserLogin(true)
				localStorage.setItem('jwt', jsonData.token)
				localStorage.setItem('user', JSON.stringify(jsonData.user))
				setTimeout(() => {
					navigate('/')
				}, 5000)
			} else if (status === 432) {
				notifyB(`${jsonData.errors[0].msg}`)
				// alert(jsonData.errors[0].msg);
			} else if (status === 422) {
				notifyB(`${jsonData.error}`)
				// alert(jsonData.error);
			} else {
				notifyB('Oops !!! enter valid credentials')
				// alert("Enter Valid Credentials.....");
			}
		} catch (error) {
			console.log(error)
			notifyB('Oops !!! enter valid credentials')
		}
	}

	return (
		<div className='signUp'>
			<div className='wrapper-container'>
				<div className='project-title-container'>
					<h1>Privacy Network</h1>
				</div>
				<div className='form-container input-div'>
					<div className='form'>
						<img src={logo} />
						<div>
							<input
								type='email'
								name='email'
								id='email'
								value={credentials.email}
								placeholder='Email Id'
								onChange={inputEvent}
							/>
						</div>
						<div>
							<input
								type='text'
								name='name'
								id='name'
								placeholder='Full Name'
								value={credentials.name}
								onChange={inputEvent}
							/>
						</div>
						<div>
							<input
								type='text'
								name='username'
								id='username'
								placeholder='Username'
								value={credentials.username}
								onChange={inputEvent}
							/>
						</div>
						<div>
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								id='password'
								placeholder='Password'
								value={credentials.password}
								onChange={inputEvent}
							/>{' '}
							<button
								type='button'
								id='show-password-btn'
								onClick={togglePasswordVisibility}
							>
								{showPassword ? 'Hide' : 'Show'} Password
							</button>
						</div>
						<input
							type='submit'
							id='submit-btn'
							value='Sign Up'
							onClick={postData}
							style={{ marginBottom: '5px' }}
						/>
						<div className='google-login-container'>
							<GoogleLogin
								onSuccess={credentialResponse => {
									continueWithGoogle(credentialResponse)
								}}
								onError={() => {
									console.log('Login Failed')
								}}
							/>
						</div>
					</div>
					<div className='form-footer'>
						Already have an account ?
						<Link to='/login' style={{ textDecoration: 'none' }}>
							<span
								style={{
									color: '#1877f2',
									cursor: 'pointer',
									fontWeight: 'bold',
								}}
							>
								{'   '} Sign In
							</span>
						</Link>
					</div>
					<ToastContainer autoClose={3000} theme='dark' />
				</div>
			</div>
		</div>
	)
}

export default Signup
