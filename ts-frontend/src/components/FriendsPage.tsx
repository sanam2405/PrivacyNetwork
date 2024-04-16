import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";

import UserCard from "./UserCard";
import FriendsCard from "./FriendsCard";
import UserBanner from "./UserBanner";
import "../styles/FriendsPage.css";
import { LoginContext } from "../context/LoginContext";

import User from "../types/types";
import Loader from "./Loader";
import HttpStatusCode from "../types/HttpStatusCode";

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

function FriendsPage() {
  const defaultPicLink =
    "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const defaultPicLink2 =
    "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [curruser, setcurrUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  const { setModalOpen } = useContext(LoginContext);
  const handleClick = () => {
    setModalOpen(true);
  };

  const colleges = [
    {
      value: "Jadavpur University",
      label: "Jadavpur University",
    },
    {
      value: "Calcutta University",
      label: "Calcutta University",
    },
    {
      value: "Presidency University",
      label: "Presidency University",
    },
    {
      value: "Kalyani University",
      label: "Kalyani University",
    },
  ];

  const genders = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
    {
      value: "Non Binary",
      label: "Non Binary",
    },
  ];

  // Modal custom stylesheet
  const style: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "70vw",
    maxWidth: "95vw",
    maxHeight: "80vh",
    backgroundColor: "#f0f0f0",
    border: "2px solid #000",
    boxShadow: "24px",
    padding: 4,
    borderRadius: 5,
    overflow: "auto",
    paddingLeft: "9rem",
  };

  // Closed Modal Icon stylesheet
  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: 5,
    right: 5,
    fontWeight: "bolder",
  };

  // Modal related hooks and utilities
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const [open2, setOpen2] = useState<boolean>(false);
  const handleOpen2 = () => setOpen2(true);

  const [age, setAge] = useState<number>(0);
  const [prevGender, setPrevGender] = useState<string>("");
  const [prevCollege, setPrevCollege] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [college, setCollege] = useState<string>("Jadavpur University");

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(event.target.value);
    const newAge = inputValue <= 0 || inputValue > 125 ? 1 : inputValue;
    setAge(newAge);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleCollegeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollege(event.target.value);
  };

  const fetchAllUserDetails = () => {
    fetch(`${BASE_API_URI}/api/allusers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          window.location.reload();
          setUsers(data.users);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchCurrentUserDetails = () => {
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
      fetch(`${BASE_API_URI}/api/user/${JSON.parse(userDetails)._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            setcurrUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            fetchAllUserDetails();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const postDetails = () => {
    console.log(age, gender, college);
    fetch(`${BASE_API_URI}/api/setProperties`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        age,
        gender,
        college,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        fetchCurrentUserDetails();
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setOpen(false);
    postDetails();
  };
  const handleClose2 = () => {
    setOpen2(false);
    postDetails();
  };

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
      setIsLoading(true);
      fetch(`${BASE_API_URI}/api/user/${JSON.parse(userDetails)._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            setcurrUser(data.user);
            setAge(data.user.age);
            setGender(data.user.gender);
            setCollege(data.user.college);
            setPrevGender(data.user.gender);
            setPrevCollege(data.user.college);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BASE_API_URI}/api/allusers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setUsers(data.users);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  // const changeProfile = () => {
  // 	setChangePic(!changePic)
  // }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pingBackend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_API_URI}/api/ping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { status } = response;

      const jsonData = await response.json();
      console.log(jsonData);
      if (status === HttpStatusCode.OK) {
        // handle signup if the backend is up and running
        setIsLoading(false);
      }
    } catch {
      // handle signup if the backend is not up and running
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pingBackend();
  }, []);

  const checker = () => {
    if (localStorage.getItem("user")) {
      return (
        <>
          {/* actual content of the screen  */}
          <div className="container">
            <div className="button-container">
              <Stack direction="row" spacing={3}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    navigate("/client");
                  }}
                  startIcon={<TravelExploreRoundedIcon />}
                >
                  Go To Map
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="success"
                  onClick={handleClick}
                  endIcon={<ExitToAppRoundedIcon />}
                >
                  Logout
                </Button>
              </Stack>
            </div>
            <div className="user-banner">
              {curruser && (
                <UserBanner
                  key={curruser.username}
                  username={curruser.username}
                  name={curruser.name}
                  dpLink={curruser.Photo ? curruser.Photo : defaultPicLink}
                />
              )}
            </div>
            <div className="options-container">
              <div className="form-container">
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      required
                      id="outlined-number"
                      label="Required"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, max: 125 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="Please select your age"
                      value={age}
                      onChange={handleAgeChange}
                    />
                  </div>
                </Box>

                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      id="outlined-select-gender"
                      select
                      label="Required"
                      required
                      value={gender}
                      onChange={handleGenderChange}
                      helperText="Please select your gender"
                    >
                      {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Box>

                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      id="outlined-select-college"
                      select
                      label="Required"
                      required
                      value={college}
                      onChange={handleCollegeChange}
                      helperText="Please select your college"
                    >
                      {colleges.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Box>
              </div>
              <div className="checkbox-container">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Show my visibility"
                  />
                </FormGroup>
              </div>
              <div className="save-edit-button-container">
                <Stack direction="row" spacing={3}>
                  {!prevGender || !prevCollege ? (
                    <Button
                      variant="contained"
                      onClick={() => postDetails()}
                      startIcon={<SaveRoundedIcon />}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => postDetails()}
                      startIcon={<SaveAsRoundedIcon />}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
              </div>
              <Stack direction="row" spacing={5}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleOpen2}
                  startIcon={<PeopleAltRoundedIcon />}
                >
                  My Friends
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpen}
                  endIcon={<GroupAddRoundedIcon />}
                >
                  Add Friends
                </Button>
              </Stack>
            </div>
          </div>
          {/* Show friends modal  */}
          <div className="modal-container">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box sx={style}>
                  <IconButton
                    aria-label="close"
                    style={closeButtonStyle}
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                  <div className="friends-modal">
                    {users.length > 0 &&
                      users.map(
                        (user) =>
                          curruser && (
                            <UserCard
                              key={user.username} // Ensure each UserCard has a unique key
                              username={user.username}
                              name={user.name}
                              dpLink={user.Photo ? user.Photo : defaultPicLink}
                              currentUsername={curruser.username}
                              user={user}
                              curruser={curruser}
                              users={users}
                              setUsers={setUsers}
                            />
                          ),
                      )}
                  </div>
                </Box>
              </Fade>
            </Modal>
          </div>
          {/* Add friends modal  */}
          <div className="modal-container">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open2}
              onClose={handleClose2}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={open2}>
                <Box sx={style}>
                  <IconButton
                    aria-label="close"
                    style={closeButtonStyle}
                    onClick={handleClose2}
                  >
                    <CloseIcon />
                  </IconButton>
                  <div className="friends-modal">
                    {users.length > 0 &&
                      users.map(
                        (user) =>
                          curruser && (
                            <FriendsCard
                              key={user.username} // Ensure each FriendsCard has a unique key
                              username={user.username}
                              name={user.name}
                              dpLink={user.Photo ? user.Photo : defaultPicLink}
                              currentUsername={curruser.username}
                              user={user}
                              curruser={curruser}
                              users={users}
                              setUsers={setUsers}
                            />
                          ),
                      )}
                  </div>
                </Box>
              </Fade>
            </Modal>
          </div>
        </>
      );
    }
    navigate("/login");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="friends-container">{checker()}</div>
      )}
    </>
  );
}

export default FriendsPage;
