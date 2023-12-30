import React from 'react'

import '../styles/UserCard.css'

function UserCard({ username, name, dpLink, currentUserName }) {
	return (
		<>
			{currentUserName !== username ? (
				<div className='container'>
					<div className='card_item'>
						<div className='card_inner'>
							<img src={dpLink} alt='' />
							<div className='Name'>{name}</div>
							<div className='userName'>{username}</div>
							<div className='userUrl' />
							<div className='detail-box'>
								<div className='gitDetail'>
									<span>College</span>JU
								</div>
								<div className='gitDetail'>
									<span>Following</span>45
								</div>
								<div className='gitDetail'>
									<span>Followers</span>11
								</div>
							</div>
							<button type='button' className='addFriend'>
								Add Friend
							</button>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}

export default UserCard
