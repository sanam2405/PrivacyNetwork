import React, { useRef, useState, useEffect } from 'react'

import '../styles/ProfilePic.css'

require('dotenv').config()

const PORT = process.env.PORT || 5050
const BASE_API_URI = `http://localhost:${PORT}`

function ProfilePic({ changeProfile }) {
	const hiddenFileInput = useRef(null)
	const [image, setImage] = useState()
	const [url, setUrl] = useState(null)

	const handleClick = () => {
		hiddenFileInput.current.click()
	}

	const postDetails = () => {
		const data = new FormData()
		data.append('file', image)
		data.append('upload_preset', 'insta-clone')
		data.append('cloud_name', 'cantacloud2')
		fetch('https://api.cloudinary.com/v1_1/cantacloud2/image/upload', {
			method: 'POST',
			body: data,
		})
			.then(res => res.json())
			.then(data => setUrl(data.url))
			.catch(err => console.log(err))
		console.log(url)
	}

	const postPic = () => {
		// saving post to mongodb
		fetch(`${BASE_API_URI}/api/uploadProfilePic`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('jwt')}`,
			},
			body: JSON.stringify({
				pic: url,
			}),
		})
			.then(res => res.json())
			.then(data => {
				console.log(data)
				changeProfile()
				window.location.reload()
			})
			.catch(err => console.log(err))
	}

	useEffect(() => {
		if (image) {
			postDetails()
		}
	}, [image])

	useEffect(() => {
		if (url) {
			postPic()
		}
	}, [url])

	return (
		<>
			<div className='profilePic'>
				<div className='changePic'>
					<div>
						<h2>Change Profile Picture</h2>
					</div>
					<div
						style={{ borderTop: '1px solid #00000070', padding: '25px 80px' }}
					>
						<button
							type='button'
							className='upload-btn'
							style={{ color: '#1EA1F7' }}
							onClick={handleClick}
						>
							Upload Profile Picture
						</button>
						<input
							type='file'
							ref={hiddenFileInput}
							accept='image/*'
							style={{ display: 'none' }}
							onChange={e => setImage(e.target.files[0])}
						/>
					</div>
					<div
						style={{ borderTop: '1px solid #00000070', padding: '25px 80px' }}
					>
						<button
							type='button'
							className='upload-btn'
							style={{ color: '#ED4956' }}
							onClick={() => {
								setUrl(null)
								postPic()
							}}
						>
							Remove Profile Picture
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProfilePic
