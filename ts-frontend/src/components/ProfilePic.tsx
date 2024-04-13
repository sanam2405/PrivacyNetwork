/* eslint-disable @typescript-eslint/no-var-requires */
import { useRef, useState, useEffect, ChangeEvent } from "react";

import "../styles/ProfilePic.css";

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

interface ProfilePicProps {
  changeProfile: () => void;
}

function ProfilePic({ changeProfile }: ProfilePicProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();
  const [url, setUrl] = useState<string | null>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const postDetails = () => {
    const data = new FormData();
    if (image) {
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "cantacloud2");
      fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => setUrl(data.url))
        .catch((err) => console.log(err));
    }
  };

  const postPic = () => {
    if (url) {
      // saving post to mongodb
      fetch(`${BASE_API_URI}/api/uploadProfilePic`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          changeProfile();
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image]);

  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="profilePic">
        <div className="changePic">
          <div>
            <h2>Change Profile Picture</h2>
          </div>
          <div
            style={{ borderTop: "1px solid #00000070", padding: "25px 80px" }}
          >
            <button
              type="button"
              className="upload-btn"
              style={{ color: "#1EA1F7" }}
              onClick={handleClick}
            >
              Upload Profile Picture
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div
            style={{ borderTop: "1px solid #00000070", padding: "25px 80px" }}
          >
            <button
              type="button"
              className="upload-btn"
              style={{ color: "#ED4956" }}
              onClick={() => {
                setUrl(null);
                postPic();
              }}
            >
              Remove Profile Picture
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePic;
