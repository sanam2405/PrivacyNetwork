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

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

export const Map = () => {
  /*
        RANDOM POSITION GENERATOR
  */
  const positions = [
    { lat: 22.4965, lng: 88.3698 },
    { lat: 22.5726, lng: 88.3639 },
    { lat: 22.5353, lng: 88.3655 },
    { lat: 22.5553, lng: 88.3645 },
    { lat: 22.5153, lng: 88.3665 },
    { lat: 22.4855, lng: 88.3675 },
    { lat: 22.5256, lng: 88.3685 },
    { lat: 22.5653, lng: 88.369 },
    { lat: 22.5123, lng: 88.3648 },
    { lat: 22.5393, lng: 88.365 },
    { lat: 22.192803, lng: 88.191301 },
    { lat: 22.199677, lng: 88.215756 },
    { lat: 22.204224, lng: 88.235726 },
    { lat: 22.208686, lng: 88.255386 },
    { lat: 22.214385, lng: 88.280428 },
    { lat: 22.225205, lng: 88.328834 },
    { lat: 22.229966, lng: 88.349735 },
    { lat: 22.241517, lng: 88.372731 },
    { lat: 22.269245, lng: 88.383791 },
    { lat: 22.267909, lng: 88.382865 },
    { lat: 22.30833, lng: 88.399316 },
    { lat: 21.947095, lng: 88.360358 },
    { lat: 22.343747, lng: 88.415399 },
    { lat: 22.365058, lng: 88.435592 },
    { lat: 22.399726, lng: 88.426911 },
    { lat: 22.413588, lng: 88.433945 },
    { lat: 22.443284, lng: 88.430303 },
    { lat: 22.450234, lng: 88.418848 },
    { lat: 22.466407, lng: 88.404713 },
    { lat: 22.470705, lng: 88.400398 },
    { lat: 22.482876, lng: 88.38669 },
    { lat: 22.494144, lng: 88.375103 },
    { lat: 22.509736, lng: 88.371144 },
    { lat: 22.518773, lng: 88.371346 },
    { lat: 22.541141, lng: 88.374328 },
    { lat: 22.567725, lng: 88.370723 },
    { lat: 22.592575, lng: 88.391069 },
    { lat: 22.62118, lng: 88.393107 },
    { lat: 22.660972, lng: 88.389375 },
    { lat: 22.680805, lng: 88.375778 },
    { lat: 22.725214, lng: 88.377706 },
    { lat: 22.743209, lng: 88.374234 },
    { lat: 22.782513, lng: 88.370096 },
    { lat: 22.798931, lng: 88.373395 },
    { lat: 22.828563, lng: 88.380438 },
    { lat: 22.85062, lng: 88.394793 },
    { lat: 22.866717, lng: 88.405524 },
    { lat: 22.886929, lng: 88.417851 },
    { lat: 22.920266, lng: 88.436643 },
    { lat: 22.946182, lng: 88.45143 },
    { lat: 22.968115, lng: 88.46675 },
    { lat: 23.006492, lng: 88.489974 },
    { lat: 23.034492, lng: 88.516643 },
    { lat: 23.057524, lng: 88.530167 },
    { lat: 23.078988, lng: 88.529714 },
    { lat: 23.127936, lng: 88.545395 },
    { lat: 23.174564, lng: 88.568963 },
    { lat: 23.208986, lng: 88.572363 },
    { lat: 22.643736, lng: 88.377695 },
    { lat: 23.26013, lng: 88.5437 },
    { lat: 23.307078, lng: 88.528913 },
    { lat: 23.386525, lng: 88.493806 },
    { lat: 22.886776, lng: 87.78327 },
    { lat: 23.425983, lng: 88.387984 },
    { lat: 22.875035, lng: 87.974362 },
    { lat: 22.882581, lng: 88.013951 },
    { lat: 22.881231, lng: 88.022232 },
    { lat: 22.861507, lng: 88.072975 },
    { lat: 22.843815, lng: 88.087634 },
    { lat: 22.81457, lng: 88.228696 },
    { lat: 22.774845, lng: 88.328334 },
    { lat: 22.758118, lng: 88.336585 },
    { lat: 22.72623, lng: 88.343514 },
    { lat: 22.700249, lng: 88.342376 },
    { lat: 22.685756, lng: 88.336076 },
    { lat: 22.666911, lng: 88.34101 },
    { lat: 22.652399, lng: 88.339432 },
    { lat: 22.653774, lng: 88.363221 },
    { lat: 22.642486, lng: 88.384715 },
    { lat: 22.646593, lng: 88.365819 },
    { lat: 22.652047, lng: 88.372884 },
    { lat: 22.649365, lng: 88.380509 },
    { lat: 25.297217, lng: 88.96951 },
    { lat: 22.655178, lng: 88.855553 },
    { lat: 22.656959, lng: 88.810309 },
    { lat: 22.65194, lng: 88.760888 },
    { lat: 22.608485, lng: 88.677177 },
    { lat: 22.565424, lng: 88.366426 },
    { lat: 22.56043, lng: 88.41363 },
    { lat: 22.6924, lng: 88.465337 },
    { lat: 22.663703, lng: 88.427231 },
    { lat: 22.518625, lng: 88.322399 },
    { lat: 22.458821, lng: 88.170565 },
    { lat: 22.51092, lng: 88.334977 },
    { lat: 22.517598, lng: 88.303709 },
    { lat: 22.518948, lng: 88.275467 },
    { lat: 22.510331, lng: 88.248996 },
    { lat: 22.50599, lng: 88.223632 },
    { lat: 22.318426, lng: 88.664697 },
    { lat: 22.350826, lng: 88.574676 },
    { lat: 22.369879, lng: 88.552876 },
    { lat: 22.38808, lng: 88.517844 },
    { lat: 22.401642, lng: 88.49357 },
    { lat: 22.425165, lng: 88.496079 },
    { lat: 21.769949, lng: 88.231513 },
    { lat: 21.879135, lng: 88.19364 },
    { lat: 21.905171, lng: 88.201012 },
    { lat: 24.801475, lng: 87.967783 },
    { lat: 29.699151, lng: 75.96615 },
    { lat: 22.099774, lng: 88.273423 },
    { lat: 22.109867, lng: 88.320873 },
    { lat: 22.141517, lng: 88.389205 }
  ];

  const getRandomPosition = () => {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  };

  const navigate = useNavigate();
  const BASE_WS_URI = import.meta.env.VITE_WS_URI;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const { socket, locations, sendMessage, openConnection, closeConnection } =
    useSocket(BASE_WS_URI);

  const [currentUserPosition, setCurrentUserPosition] =
    useState(getRandomPosition());

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

  const socketCommSENDLOC = () => {
    if (socket) {
      setTimeout(() => {
        setCurrentUserPosition(getRandomPosition());
        sendMessage({
          type: "SEND_LOCATION",
          payload: {
            userId: currentUserUUID,
            roomId: "202A",
            position: currentUserPosition,
          },
        });
      }, 5000);

      // setTimeout(() => {
      //   sendMessage({
      //     type: "SEND_LOCATION",
      //     payload: {
      //       userId: "1b",
      //       roomId: "202A",
      //       position: { lat: 22.5726, lng: 88.3639 },
      //     },
      //   });
      // }, 7500);

      // setTimeout(() => {
      //   sendMessage({
      //     type: "SEND_LOCATION",
      //     payload: {
      //       userId: "1c",
      //       roomId: "202A",
      //       position: { lat: 22.5353, lng: 88.3655 },
      //     },
      //   });
      // }, 11000);
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
        userId: "Manasass2345w53q46f",
        latitude: 22.40456,
        longitude: 88.126,
        thresholdDistance: sliderValue * 1000,
        age,
        gender,
        college,
        isVisible: true, // pass false if you wish to see the invisible ones
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response from LOC server was not OK");
        }
        return res.json();
      })
      .then((data) => {
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
                key="11111"
                position={{ lat: adminLocation.lat, lng: adminLocation.lng }}
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
                  loc.long && (
                    <Marker
                      key={index}
                      position={{ lat: loc.lat, lng: loc.long }}
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
                    Connect
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
                    Disconnect
                  </Button>
                </Stack>
              </div>
            </div>
          </Grid>
        )}
      </Grid>

      {/* {socket ? <h1>{latestMessage}</h1> : <Loader />} */}
    </>
  ) : (
    <></>
  );
};
