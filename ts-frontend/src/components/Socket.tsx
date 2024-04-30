import { useEffect, useState } from "react";
import Loader from "./Loader";
import {
  Circle,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
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
    navigate("/auth");
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

  const friendSvgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
  };

  const circleCenter = {
    lat: positions[4].lat,
    lng: positions[4].lng,
  };

  const circleOption = {
    // strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    // fillColor: "#FF0000",
    fillColor: "yellow",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 1000,
    zIndex: 1,
  };

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

              <Marker
                // profile photo marker with animation

                // icon takes a SVG path or a URI. it can also take image component
                // https://developers.google.com/maps/documentation/javascript/examples/icon-simple
                icon={
                  "https://res.cloudinary.com/cantacloud2/image/upload/w_40,h_40,c_scale/v1714385887/yylk2ptdmpdbxfdjvitx.png"
                }
                position={{ lat: positions[0].lat, lng: positions[0].lng }}
                animation={google.maps.Animation.DROP}
              />

              <Marker
                // normal marker with animation

                // animation can take values : google.maps.Animation.DROP or google.maps.Animation.BOUNCE
                // https://developers.google.com/maps/documentation/javascript/examples/marker-animations
                position={{ lat: positions[1].lat, lng: positions[1].lng }}
                animation={google.maps.Animation.BOUNCE}
              />

              <Marker
                // custom vector image marker with animation

                // animation can take values : google.maps.Animation.DROP or google.maps.Animation.BOUNCE
                // https://developers.google.com/maps/documentation/javascript/examples/marker-animations

                // using a custom SVG vector image
                position={{ lat: positions[2].lat, lng: positions[2].lng }}
                animation={google.maps.Animation.DROP}
                icon={friendSvgMarker}
              />

              <Marker
                // normal marker with label and animation
                // animation can take values : google.maps.Animation.DROP or google.maps.Animation.BOUNCE
                // https://developers.google.com/maps/documentation/javascript/examples/marker-animations

                // using a custom label for Friends
                position={{ lat: positions[3].lat, lng: positions[3].lng }}
                animation={google.maps.Animation.DROP}
                label={"F"}
              />

              <Circle
                // Circle shows the masked approximate distance of the users that are not friends

                center={circleCenter}
                options={circleOption}
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
