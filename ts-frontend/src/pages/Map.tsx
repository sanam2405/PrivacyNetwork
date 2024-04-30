/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import IconButton from "@mui/material/IconButton";
import Fingerprint from "@mui/icons-material/Fingerprint";
import { Grid } from "@mui/material";
import {
  Circle,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import "../styles/Map.css";
import useSocket from "../hooks/ws";
import { useNavigate } from "react-router-dom";
import { distances, ages } from "../constants";
import { genders } from "../constants";
import { colleges } from "../constants";
import { LoginContext } from "../context/LoginContext";
import { useQLocations } from "../context/QLocationContext";
import DetailsDialogBox, { Details } from "../components/DetailsDialogBox";
import { positions } from "../constants";
import { ToastContainer } from "react-toastify";
import User from "../types/types";
import {
  circleOptionForFriends,
  circleOptionForNonFriends,
  DEFAULT_MARKER_PIC,
  DEFAULT_PROFILE_URL,
} from "../constants";

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

interface Location {
  lat: number;
  lng: number;
}

export const Map = () => {
  const navigate = useNavigate();
  /*
        RANDOM POSITION GENERATOR
  */

  const getRandomPosition = () => {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  };
  const BASE_WS_URI = import.meta.env.VITE_WS_URI;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const {
    socket,
    locations,
    sendMessage,
    openConnection,
    closeConnection,
    isWsConnected,
  } = useSocket(BASE_WS_URI);

  const [currentUserPosition] = useState<Location>(getRandomPosition());

  if (!apiKey)
    throw new Error("GOOGLE_API_KEY environment variable is not set");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });
  const [currentMapCenter] = useState({
    lat: 22.54905,
    lng: 88.37816,
  });
  const [clickedIndex, setClickedIndex] = useState<number>(-1);

  const userDetails = localStorage.getItem("user");
  if (!userDetails) {
    navigate("/auth");
    return;
  }

  const currentUserUUID = JSON.parse(userDetails)._id;
  const currentUserName = JSON.parse(userDetails).name;

  const socketCommJOINROOM = () => {
    if (socket) {
      //  Initial messages after WebSocket connection is established
      sendMessage({
        type: "JOIN_ROOM",
        payload: {
          name: currentUserName,
          userId: currentUserUUID,
          roomId: "202A",
        },
      });
    }
  };

  const updateCurrentLocation = (position: Location) => {
    fetch(`${BASE_API_URI}/api/setLocation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        lat: position.lat,
        lng: position.lng,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Successfully updated current location ...");
        }
      })
      .catch((err) => console.log(err));
  };

  const socketCommSENDLOC = () => {
    if (socket) {
      setTimeout(() => {
        // setCurrentUserPosition(getRandomPosition());
        // const position = getRandomPosition();
        // setCurrentUserPosition(position);
        sendMessage({
          type: "SEND_LOCATION",
          payload: {
            userId: currentUserUUID,
            roomId: "202A",
            position: currentUserPosition,
          },
        });
        updateCurrentLocation(currentUserPosition);
      }, 5000);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intervalId: any;
    if (socket) {
      socket.onopen = () => {
        console.log("WebSocket connection established from client side");
        socketCommJOINROOM();
        intervalId = setInterval(() => {
          socketCommSENDLOC();
        }, 3000);
      };
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [socket]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/auth");
    }
  }, []);

  const handleSocketConnection = () => {
    // first close if already soc conn exist

    closeConnection("202A", currentUserUUID);

    // open a new soc conn if doesn't exist
    openConnection();
  };

  const handleSocketDisconnection = () => {
    // close if already soc conn exist
    closeConnection("202A", currentUserUUID);
  };

  const handleCloseDialogBox = () => {
    setClickedIndex(-1);
  };

  const [curruser, setcurrUser] = useState<User>();
  const [age, setAge] = useState(50);
  const [gender, setGender] = useState("Male");
  const [college, setCollege] = useState("Jadavpur University");
  const [sliderValue, setSliderValue] = useState(60);
  const [isMinimize, setIsMinimize] = useState<boolean>(false);

  const { qLocations, setQLocations } = useQLocations();

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
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const updateDetailsOfQueriedUsers = () => {
    fetch(`${BASE_API_URI}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        userId: currentUserUUID,
        latitude: 22.40456,
        longitude: 88.126,
        thresholdDistance: sliderValue * 1000,
        age,
        gender,
        college,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response from LOC server was not OK");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Response raw data : ");
        console.log(data);
        setQLocations(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchCurrentUserDetails();
    setTimeout(() => {
      setIsMinimize(true);
    }, 2500);
  }, []);

  const containerStyle = {
    width: isMinimize ? "60vw" : "100vw",
    height: "100vh",
  };

  const handleGenderChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setGender(event.target.value);
  };
  const handleCollegeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCollege(event.target.value);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSliderChange = (event: any) => {
    setSliderValue(event?.target?.value);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAgeSliderChange = (event: any) => {
    setAge(parseFloat(event?.target?.value));
  };

  const { setModalOpen } = useContext(LoginContext);
  const handleClick = () => {
    setModalOpen(true);
  };

  // Image processing and parsing
  function insertTransformationParams(url: string): string {
    if (url === DEFAULT_PROFILE_URL) {
      return DEFAULT_MARKER_PIC;
    }
    // Find the index of "/image/upload" in the URL
    const uploadIndex = url.indexOf("/image/upload");
    if (uploadIndex !== -1) {
      const modifiedUrl =
        url.slice(0, uploadIndex + "/image/upload".length) +
        "/w_60,h_60,c_scale" +
        url.slice(uploadIndex + "/image/upload".length);
      console.log(modifiedUrl);
      return modifiedUrl;
    } else {
      // If "/image/upload" is not found, return the original URL
      return url;
    }
  }

  function ifCurrentUserMyFriend(id: string): boolean {
    if (curruser?.friends.includes(id)) return true;
    else return false;
  }

  function isIDExistInMyLocation(id: string): boolean {
    const idExistsinLocation = qLocations.filter((loc) => {
      return loc.id === id;
    });
    // console.log("This is the id : ", id);
    // console.log("Array of locations : ");
    // console.log(idExistsinLocation);
    if (idExistsinLocation.length === 0) return false;
    else return true;
  }

  const onLoad = (circle: google.maps.Circle) => {
    console.log("Circle onLoad circle: ", circle);
  };

  const onUnmount = (circle: google.maps.Circle) => {
    console.log("Circle onUnmount circle: ", circle);
  };

  return isLoaded ? (
    <>
      <Grid container spacing={5}>
        <Grid item xs={isMinimize ? 7 : 12}>
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentMapCenter}
              zoom={9}
            >
              <Marker
                key={qLocations.length}
                onClick={() => {
                  setClickedIndex(qLocations.length);
                }}
                position={{
                  lat: currentUserPosition.lat,
                  lng: currentUserPosition.lng,
                }}
                icon={{
                  url: curruser?.Photo
                    ? insertTransformationParams(curruser?.Photo)
                    : DEFAULT_PROFILE_URL,
                  scaledSize: new google.maps.Size(40, 40),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(20, 40),
                }}
                animation={google.maps.Animation.BOUNCE}
              />
              {clickedIndex === qLocations.length && (
                <DetailsDialogBox
                  details={curruser as Details}
                  position={{
                    lat: currentUserPosition.lat,
                    lng: currentUserPosition.lng,
                  }}
                  handleCloseDialogBox={handleCloseDialogBox}
                />
              )}
              {locations.map((loc, index) => {
                return (
                  loc.lat &&
                  loc.lng && (
                    <Marker
                      key={index}
                      position={{ lat: loc.lat, lng: loc.lng }}
                    />
                  )
                );
              })}
              {qLocations.map((loc, index) => {
                if (
                  loc.lat &&
                  loc.lng &&
                  loc.hasOwnProperty("mask") &&
                  loc.mask === true &&
                  isIDExistInMyLocation(loc.id)
                ) {
                  // Who mark their visibility as false (friends / non-friends)
                  return (
                    <>
                      <Circle
                        key={index}
                        onLoad={onLoad}
                        onCenterChanged={() => {}}
                        onUnmount={onUnmount}
                        onClick={() => {
                          setClickedIndex(index);
                        }}
                        center={{
                          lat: loc.lat,
                          lng: loc.lng,
                        }}
                        options={
                          ifCurrentUserMyFriend(loc.id)
                            ? circleOptionForFriends
                            : circleOptionForNonFriends
                        }
                      />
                      {clickedIndex === index && (
                        <DetailsDialogBox
                          details={loc}
                          position={{ lat: loc.lat, lng: loc.lng }}
                          handleCloseDialogBox={handleCloseDialogBox}
                        />
                      )}
                    </>
                  );
                } else if (
                  loc.lat &&
                  loc.lng &&
                  loc.hasOwnProperty("mask") &&
                  loc.mask === false
                ) {
                  // Who are friends and mark their visibility as true
                  return (
                    <>
                      <Marker
                        key={index}
                        // icon={{
                        //   url: loc?.Photo
                        //     ? insertTransformationParams(loc?.Photo)
                        //     : DEFAULT_MARKER_PIC,
                        //   scaledSize: new google.maps.Size(40, 40),
                        //   origin: new google.maps.Point(0, 0),
                        //   anchor: new google.maps.Point(20, 40),
                        // }}
                        position={{ lat: loc.lat, lng: loc.lng }}
                        label={loc.name[0]}
                        animation={google.maps.Animation.DROP}
                        onClick={() => {
                          setClickedIndex(index);
                        }}
                      />
                      {clickedIndex === index && (
                        <DetailsDialogBox
                          details={loc}
                          position={{ lat: loc.lat, lng: loc.lng }}
                          handleCloseDialogBox={handleCloseDialogBox}
                        />
                      )}
                    </>
                  );
                }
                // Optionally handle other cases
              })}
            </GoogleMap>
          </div>
        </Grid>
        {isMinimize && (
          <Grid item xs={4.5}>
            <div className="option-container">
              <div>
                <Stack direction="row" spacing={25}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                    startIcon={<AccountCircleIcon />}
                  >
                    Profile
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
              <Box sx={{ marginTop: 4 }}>
                <Slider
                  aria-label="Custom marks"
                  step={10}
                  valueLabelDisplay="auto"
                  marks={distances}
                  value={sliderValue}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e: any) => handleSliderChange(e)}
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": {
                    m: 1,
                    width: "27.5rem",
                    marginTop: "4rem",
                  },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    id="outlined-select-gender"
                    select
                    label="Gender"
                    required
                    value={gender}
                    onChange={(e) => handleGenderChange(e)}
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
                  "& .MuiTextField-root": {
                    m: 1,
                    width: "27.5rem",
                    marginTop: "4rem",
                  },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    id="outlined-select-college"
                    select
                    label="College"
                    required
                    value={college}
                    onChange={(e) => handleCollegeChange(e)}
                  >
                    {colleges.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Box>
              <Box sx={{ marginTop: 7 }}>
                <Slider
                  aria-label="Custom age"
                  step={10}
                  valueLabelDisplay="auto"
                  marks={ages}
                  value={age}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e: any) => handleAgeSliderChange(e)}
                />
              </Box>
              <Box
                display={"flex"}
                flex={1}
                justifyContent={"center"}
                alignItems={"center"}
                height={100}
              >
                <IconButton
                  aria-label="fingerprint"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    updateDetailsOfQueriedUsers();
                  }}
                  sx={{ marginTop: 2 }}
                >
                  <Fingerprint />
                </IconButton>
              </Box>
              <div>
                <Stack direction="row" spacing={20} marginTop={5}>
                  <Button
                    variant="outlined"
                    size="large"
                    color="success"
                    onClick={() => {
                      handleSocketConnection();
                    }}
                    startIcon={<WifiIcon />}
                  >
                    {isWsConnected ? "Connected" : "Connect"}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="error"
                    onClick={() => {
                      handleSocketDisconnection();
                    }}
                    endIcon={<WifiOffIcon />}
                  >
                    {!isWsConnected ? "Disconnected" : "Disconnect"}
                  </Button>
                </Stack>
              </div>
            </div>
          </Grid>
        )}
      </Grid>
      <ToastContainer autoClose={1000} theme="dark" />
      {/* {socket ? <h1>{latestMessage}</h1> : <Loader />} */}
    </>
  ) : (
    <></>
  );
};
