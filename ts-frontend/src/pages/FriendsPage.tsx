/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
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
import UserCard from "../components/UserCard";
import FriendsCard from "../components/FriendsCard";
import UserBanner from "../components/UserBanner";
import "../styles/FriendsPage.css";
import { LoginContext } from "../context/LoginContext";
import { defaultPicLink } from "../constants";
import User from "../types/types";
import Loader from "../components/Loader";
import HttpStatusCode from "../types/HttpStatusCode";
import { colleges } from "../constants";
import { genders } from "../constants";
import { debounce } from "lodash";

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

function FriendsPage() {
  const navigate = useNavigate();
  const [curruser, setcurrUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [nonFriends, setNonFriends] = useState<User[]>([]);

  const { setModalOpen } = useContext(LoginContext);
  const handleClick = () => {
    setModalOpen(true);
  };

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
    paddingLeft: "2rem",
    paddingRight: "2rem",
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

  const [prevAge, setPrevAge] = useState<number>(0);
  const [prevGender, setPrevGender] = useState<string>("");
  const [prevCollege, setPrevCollege] = useState<string>("");
  const [_prevVisibility, setPrevVisibility] = useState<boolean>(false);
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(true);
  const [searchFriendsKeyword, setSearchFriendsKeyword] = useState<string>("");
  const [searchNonFriendsKeyword, setSearchNonFriendsKeyword] =
    useState<string>("");

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
  const handleVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVisibility(event.target.checked);
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
            if (data.user.age) {
              setAge(data.user.age);
              setPrevAge(data.user.age);
            }
            if (data.user.college) {
              setCollege(data.user.college);
              setPrevCollege(data.user.college);
            }
            if (data.user.gender) {
              setGender(data.user.gender);
              setPrevGender(data.user.gender);
            }
            if (data.user.visibility) {
              setVisibility(data.user.visibility);
              setPrevVisibility(data.user.visibility);
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const postDetails = () => {
    console.log(age, gender, college, visibility);
    setIsLoading(true);
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
        visibility,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        fetchCurrentUserDetails();
        setCanEdit(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setSearchNonFriendsKeyword("");
  };
  const handleClose2 = () => {
    setOpen2(false);
    setSearchFriendsKeyword("");
  };

  useEffect(() => {
    setShowImage(false);
    setTimeout(() => {
      setShowImage(true);
    }, 2500);
  }, []);

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
      setIsLoading(true);
      // setShowImage(false);
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
            setAge(data.user.age ? data.user.age : 0);
            setGender(data.user.gender);
            setCollege(data.user.college);
            setVisibility(data.user.visibility ? data.user.visibility : false);
            setPrevAge(data.user.age ? data.user.age : 0);
            setPrevGender(data.user.gender);
            setPrevCollege(data.user.college);
            setPrevVisibility(
              data.user.visibility ? data.user.visibility : false,
            );
          }
          setIsLoading(false);
          // setShowImage(true);
        })
        .catch((err) => {
          setIsLoading(false);
          // setShowImage(true);
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

  const fetchFriendsByKeyWord = () => {
    fetch(`${BASE_API_URI}/api/search-friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        key: searchFriendsKeyword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setFriends([]);
        } else {
          setFriends(data.friends);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchNonFriendsByKeyWord = () => {
    fetch(`${BASE_API_URI}/api/search-non-friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        key: searchNonFriendsKeyword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setNonFriends([]);
        } else {
          setNonFriends(data.nonFriends);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const debouncedSearchFriends = debounce(fetchFriendsByKeyWord, 300);
    debouncedSearchFriends();
    return () => {
      debouncedSearchFriends.cancel();
    };
  }, [searchFriendsKeyword]);

  useEffect(() => {
    const debouncedSearchNonFriends = debounce(fetchNonFriendsByKeyWord, 300);
    debouncedSearchNonFriends();
    return () => {
      debouncedSearchNonFriends.cancel();
    };
  }, [searchNonFriendsKeyword]);

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

  const checkAgeValidation = (age: number) => {
    if (canEdit) return false;
    if (!age || age <= 0) return false;
    else return true;
  };

  const checkGenderValidation = (gender: string) => {
    if (canEdit) return false;
    if (!gender || gender.length === 0) return false;
    else return true;
  };

  const checkCollegeValidation = (college: string) => {
    if (canEdit) return false;
    if (!college || college.length === 0) return false;
    else return true;
  };

  const checkVisibilityValidation = () => {
    if (
      !checkAgeValidation(prevAge) ||
      !checkGenderValidation(prevGender) ||
      !checkCollegeValidation(prevCollege)
    )
      return false;
    else return true;
  };

  const isFirstSave = () => {
    if (canEdit) return true;
    if (
      !prevAge ||
      prevAge === 0 ||
      !prevGender ||
      prevGender.length === 0 ||
      !prevCollege ||
      prevCollege.length === 0
    )
      return true;
    else return false;
  };

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
                    navigate("/map");
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
                  showImage={showImage}
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
                      disabled={checkAgeValidation(prevAge)}
                      helperText={!canEdit ? "Please select your age" : ""}
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
                      disabled={checkGenderValidation(prevGender)}
                      value={gender}
                      onChange={handleGenderChange}
                      helperText={!canEdit ? "Please select your gender" : ""}
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
                      disabled={checkCollegeValidation(prevCollege)}
                      value={college}
                      onChange={handleCollegeChange}
                      helperText={!canEdit ? "Please select your college" : ""}
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
                    control={
                      <Checkbox
                        checked={visibility}
                        onChange={handleVisibilityChange}
                        disabled={checkVisibilityValidation()}
                      />
                    }
                    label="Show my visibility"
                  />
                </FormGroup>
              </div>
              <div className="save-edit-button-container">
                <Stack direction="row" spacing={3}>
                  {isFirstSave() ? (
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
                      onClick={() => {
                        setCanEdit(true);
                      }}
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
          {/* Add friends modal  */}
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
                  <div className="search-bar-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search users..."
                      value={searchNonFriendsKeyword}
                      onChange={(e) =>
                        setSearchNonFriendsKeyword(e.target.value)
                      }
                    />
                  </div>
                  <div
                    className={
                      nonFriends.length === 0
                        ? "zeroth-message-modal"
                        : "friends-modal"
                    }
                  >
                    {nonFriends.length === 0 && <h3>No users found !!!</h3>}
                    {nonFriends.length > 0 &&
                      nonFriends.map(
                        (user) =>
                          curruser && (
                            <UserCard
                              key={user.username} // Ensure each UserCard has a unique key
                              username={user.username}
                              name={user.name}
                              dpLink={user.Photo ? user.Photo : defaultPicLink}
                              user={user}
                              users={users}
                              setUsers={setUsers}
                              fetchAllUserDetails={fetchAllUserDetails}
                              fetchCurrentUserDetails={fetchCurrentUserDetails}
                              fetchFriendsByKeyWord={fetchFriendsByKeyWord}
                              fetchNonFriendsByKeyWord={
                                fetchNonFriendsByKeyWord
                              }
                            />
                          ),
                      )}
                  </div>
                </Box>
              </Fade>
            </Modal>
          </div>
          {/* Show friends modal  */}
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
                  <div className="search-bar-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search users..."
                      value={searchFriendsKeyword}
                      onChange={(e) => setSearchFriendsKeyword(e.target.value)}
                    />
                  </div>
                  <div
                    className={
                      friends.length === 0
                        ? "zeroth-message-modal"
                        : "friends-modal"
                    }
                  >
                    {friends.length === 0 && <h3>No friends found !!!</h3>}
                    {friends.length > 0 &&
                      friends.map(
                        (user) =>
                          curruser && (
                            <FriendsCard
                              key={user.username}
                              username={user.username}
                              name={user.name}
                              dpLink={user.Photo ? user.Photo : defaultPicLink}
                              user={user}
                              users={users}
                              setUsers={setUsers}
                              fetchAllUserDetails={fetchAllUserDetails}
                              fetchCurrentUserDetails={fetchCurrentUserDetails}
                              fetchFriendsByKeyWord={fetchFriendsByKeyWord}
                              fetchNonFriendsByKeyWord={
                                fetchNonFriendsByKeyWord
                              }
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
    navigate("/auth");
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
