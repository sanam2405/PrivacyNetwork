/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ProfilePic from "./ProfilePic";
import "../styles/UserBanner.css";

interface UserBannerProps {
  username: string;
  name: string;
  dpLink: string;
}

function UserBanner({ username, name, dpLink }: UserBannerProps) {
  const [changePic, setChangePic] = useState<boolean>(false);
  // const handleOpen3 = () => setChangePic(true)
  const handleClose3 = () => setChangePic(false);

  // Modal custom stylesheet
  const style = {
    position: "absolute" as const,
    top: "50%" as const,
    left: "50%" as const,
    transform: "translate(-50%, -50%)" as const,
    maxWidth: "28vw" as const,
    minHeight: "40vh" as const,
    maxHeight: "50vh" as const,
    bgcolor: "#f0f0f0" as const,
    border: "2px solid #000" as const,
    boxShadow: 24 as const,
    p: 4 as const,
    borderRadius: 5 as const,
    backgroundColor: "#f0f2f5" as const,
  };

  // Closed Modal Icon stylesheet
  const closeButtonStyle = {
    position: "absolute" as const,
    top: 5 as const,
    right: 5 as const,
    fontWeight: "bolder" as const,
  };

  const changeProfile = () => {
    setChangePic(!changePic);
  };

  return (
    <>
      <div className="user-banner-container">
        <div className="profile-photo-container">
          <img
            className="user-profile-img"
            onClick={changeProfile}
            onKeyDown={changeProfile}
            src={dpLink}
            alt="User Profile Photo"
          />
        </div>
        <div className="user-details-container">
          <div className="user-full-name">
            <h1>{name}</h1>
          </div>
          <div className="user-username">
            <h3>@{username}</h3>
          </div>
        </div>
      </div>
      {/* Upload profile picture modal  */}
      <div className="modal-container-2">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={changePic}
          onClose={handleClose3}
          closeAfterTransition
          BackdropComponent={Backdrop} // Use BackdropComponent instead of backdropComponent
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={changePic}>
            <Box sx={style}>
              {" "}
              {/* Cast style object as any */}
              <IconButton
                aria-label="close"
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
  );
}

export default UserBanner;
