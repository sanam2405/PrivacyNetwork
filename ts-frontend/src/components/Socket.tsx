import { useEffect, useState } from "react";
import Loader from "./Loader";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/Map.css";
import useSocket from "../hooks/ws";
import { useNavigate } from "react-router-dom";

export const Socket = () => {
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
  ];

  const getRandomPosition = () => {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  };

  const navigate = useNavigate();
  const BASE_WS_URI = import.meta.env.VITE_WS_URI;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const { socket, latestMessage, locations, sendMessage } =
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
    navigate("/login");
    return;
  }

  const currentUserUUID = JSON.parse(userDetails)._id;
  const currentUserName = JSON.parse(userDetails).name;

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intervalId: any;
    if (socket) {
      socket.onopen = () => {
        // console.log("WebSocket connection established from client side");
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

  return isLoaded ? (
    <>
      <div className="complete-container">
        <div className="map-container">
          <div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentMapCenter}
              zoom={12}
            >
              {/* Current Location  */}
              <Marker
                position={{ lat: adminLocation.lat, lng: adminLocation.lng }}
              />

              {locations.map((loc, index) => {
                // console.log("DEBUG LOC : ", loc.lat, loc.lng);
                // console.log("ALL LOC from component : ", locations);
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
            </GoogleMap>
          </div>
        </div>
      </div>

      {socket ? <h1>{latestMessage}</h1> : <Loader />}
    </>
  ) : (
    <></>
  );
};
