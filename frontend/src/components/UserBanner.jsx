import React from 'react'

import '../styles/UserBanner.css'

function UserBanner({ username, name, dpLink }) {
	return (
		<div className='user-banner-container'>
			<div className='profile-photo-container'>
				<img
					className='user-profile-img'
					// onClick={changeProfile}
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
	)
}

export default UserBanner
