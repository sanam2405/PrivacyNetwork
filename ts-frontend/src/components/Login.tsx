/* eslint-disable @typescript-eslint/no-var-requires */
import { useState, useContext, ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Signup_Login.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LoginContext } from '../context/LoginContext'
import logo from '../../public/images/sign-up.png'

const PORT: number | string = import.meta.env.VITE_PORT || 5050
const BASE_API_URI: string = `http://localhost:${PORT}`

interface Credentials {
	email: string
	password: string
}

function Login(): JSX.Element {
	const [credentials, setCredentials] = useState<Credentials>({
		email: '',
		password: '',
	})

	const [showPassword, setShowPassword] = useState<boolean>(false)

	const togglePasswordVisibility = (): void => {
		setShowPassword(!showPassword)
	}

	const inputEvent = (event: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target
		setCredentials({ ...credentials, [name]: value })
	}

	const navigate = useNavigate()

	const notifyA = (message: string): void => {
		toast.success(message)
	}
	const notifyB = (message: string): void => {
		toast.error(message)
	}

	const { setUserLogin } = useContext(LoginContext)

	const postData = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> => {
		event.preventDefault()
		try {
			const response = await fetch(`${BASE_API_URI}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: credentials.email,
					password: credentials.password,
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
					navigate('/friendsPage')
				}, 2000)
			} else if (status === 422) {
				notifyB(jsonData.error)
			} else if (status === 432) {
				notifyB(jsonData.errors[0].msg)
			} else {
				notifyB('Enter valid login details...')
			}
		} catch (error) {
			console.log(error)
			notifyB('Enter valid login details...')
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
						<img src={logo} alt='User Profile Photo' />
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
								type={showPassword ? 'text' : 'password'}
								name='password'
								id='password'
								placeholder='Password'
								value={credentials.password}
								onChange={inputEvent}
							/>
							<button
								type='button'
								id='show-password-btn'
								onClick={togglePasswordVisibility}
							>
								{showPassword ? 'Hide' : 'Show'} Password
							</button>
						</div>
						<button
							type='submit'
							id='submit-btn'
							onClick={event => postData(event)}
						>
							Log in
						</button>
						<div className='form-footer'>
							<br />
							Don't have an account ?
							<br />
							<Link to='/' style={{ textDecoration: 'none' }}>
								<span
									style={{
										color: '#1877f2',
										cursor: 'pointer',
										fontWeight: 'bold',
									}}
								>
									{'   '} Sign up
								</span>
							</Link>
						</div>
					</div>

					<ToastContainer autoClose={3000} theme='dark' />
				</div>
			</div>
		</div>
	)
}

export default Login
