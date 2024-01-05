import React, { useContext } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import '../styles/LogoutModal.css'
import { RiCloseLine } from 'react-icons/ri'

import { LoginContext } from '../context/LoginContext'

function LogoutModal() {
	const { setModalOpen } = useContext(LoginContext)
	const { setUserLogin } = useContext(LoginContext)

	const handleCancel = () => {
		setModalOpen(false)
	}

	const handleLogout = () => {
		setModalOpen(false)
		setUserLogin(false)
		localStorage.removeItem('jwt')
		localStorage.removeItem('user')
	}

	return (
		<>
			<div className='darkBg'>
				<div className='centered'>
					<div className='modal'>
						<div className='modalHeader'>
							<h5 className='heading'>Confirm</h5>
						</div>
						<button
							type='button'
							className='closeBtn'
							onClick={handleCancel}
							aria-label='close-button'
						>
							<RiCloseLine />
						</button>
						<div className='modalContent'>Do you really want to log out ?</div>
						<div className='modalActions'>
							<div className='actionsContainer'>
								<Stack direction='row' spacing={3}>
									<Button
										variant='contained'
										color='error'
										onClick={handleLogout}
									>
										Logout
									</Button>
									<Button
										variant='outlined'
										color='success'
										onClick={handleCancel}
									>
										Cancel
									</Button>
								</Stack>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default LogoutModal
