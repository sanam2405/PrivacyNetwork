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
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/Map.css";
import useSocket from "../hooks/ws";
import { useNavigate } from "react-router-dom";
import { distances, ages } from "../constants";
import { genders } from "../constants";
import { colleges } from "../constants";
import { LoginContext } from "../context/LoginContext";
import { useQLocations } from "../context/QLocationContext";
import { positions } from "../constants";
import { ToastContainer } from "react-toastify";

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

interface Location {
  lat: number;
  lng: number;
}

export const Map = () => {
  /*
        RANDOM POSITION GENERATOR
  */

  const getRandomPosition = () => {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  };

  const navigate = useNavigate();
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

  const [currentUserPosition, setCurrentUserPosition] =
    useState<Location>(getRandomPosition());

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
  const [adminLocation] = useState({
    lat: 22.54905,
    lng: 88.37816,
  });

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

  const [age, setAge] = useState(50);
  const [gender, setGender] = useState("Male");
  const [college, setCollege] = useState("Jadavpur University");
  const [sliderValue, setSliderValue] = useState(60);
  const [isMinimize, setIsMinimize] = useState<boolean>(false);

  const { qLocations, setQLocations } = useQLocations();

  const updateDetails = () => {
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
      .catch((err) => console.error(err));
  };

  useEffect(() => {
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

  return isLoaded ? (
    <>
      <Grid container spacing={5}>
        <Grid item xs={isMinimize ? 7 : 12}>
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentMapCenter}
              zoom={12}
            >
              <Marker
                key="1111"
                position={{
                  lat: currentUserPosition.lat,
                  lng: currentUserPosition.lng,
                }}
              />
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
                return (
                  loc.lat &&
                  loc.lng && (
                    <Marker
                      key={index}
                      position={{ lat: loc.lat, lng: loc.lng }}
                      animation={google.maps.Animation.DROP}
                    />
                  )
                );
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
                {/* <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={() => {
                    updateDetails();
                  }}
                  sx={{ marginTop: 2 }} // Add margin-top to separate from the slider
                >
                  Query
                </Button> */}
                <IconButton
                  aria-label="fingerprint"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    updateDetails();
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
