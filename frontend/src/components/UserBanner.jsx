import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import ProfilePic from './ProfilePic'
import '../styles/UserBanner.css'

function UserBanner({ username, name, dpLink }) {
	const [changePic, setChangePic] = useState(false)
	const handleOpen3 = () => setChangePic(true)
	const handleClose3 = () => setChangePic(false)

	// Modal custom stylesheet
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxWidth: '28vw',
		minHeight: '40vh',
		maxHeight: '50vh',
		bgcolor: '#f0f0f0',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		borderRadius: 5,
		backgroundColor: '#f0f2f5',
	}

	// Closed Modal Icon stylesheet
	const closeButtonStyle = {
		position: 'absolute',
		top: 5,
		right: 5,
		fontWeight: 'bolder',
	}

	const changeProfile = () => {
		setChangePic(!changePic)
	}

	return (
		<>
			<div className='user-banner-container'>
				<div className='profile-photo-container'>
					<img
						className='user-profile-img'
						onClick={changeProfile}
						onKeyDown={changeProfile}
						src={dpLink}
						alt='User Profile Photo'
					/>
				</div>
				<div className='user-details-container'>
					<div className='user-full-name'>
						<h1>{name}</h1>
					</div>
					<div className='user-username'>
						<h3>@{username}</h3>
					</div>
				</div>
			</div>
			{/* Upload profile picture modal  */}
			<div className='modal-container-2'>
				<Modal
					aria-labelledby='transition-modal-title'
					aria-describedby='transition-modal-description'
					open={changePic}
					onClose={handleClose3}
					closeAfterTransition
					slots={{ backdrop: Backdrop }}
					slotProps={{
						backdrop: {
							timeout: 500,
						},
					}}
				>
					<Fade in={changePic}>
						<Box sx={style}>
							<IconButton
								aria-label='close'
								style={closeButtonStyle}
								onClick={handleClose3}
							>
								<CloseIcon />
							</IconButton>
							{/* Component to update the profile picture of the current user  */}
							<ProfilePic changeProfile={changeProfile} />
						</Box>
					</Fade>
				</Modal>
			</div>
		</>
	)
}

export default UserBanner
