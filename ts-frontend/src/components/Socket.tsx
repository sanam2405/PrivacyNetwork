import { useEffect, useState } from "react";
import Loader from "./Loader";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/Map.css";
import useSocket from "../hooks/ws";

export const Socket = () => {
  const BASE_WS_URI = import.meta.env.VITE_WS_URI;

  const { socket, latestMessage, locations, sendMessage } =
    useSocket(BASE_WS_URI);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!apiKey)
    throw new Error("GOOGLE_API_KEY environment variable is not set");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const [currentCenter] = useState({
    lat: 22.54905,
    lng: 88.37816,
  });
  const [location] = useState({
    lat: 22.54905,
    lng: 88.37816,
  });

  const socketCommunication = () => {
    if (socket) {
      // Send initial messages after WebSocket connection is established
      sendMessage({
        type: "JOIN_ROOM",
        payload: { name: "Manas", userId: "1a", roomId: "202A" },
      });

      sendMessage({
        type: "JOIN_ROOM",
        payload: { name: "Manasi", userId: "1b", roomId: "202A" },
      });

      sendMessage({
        type: "JOIN_ROOM",
        payload: { name: "Sanam", userId: "1c", roomId: "202A" },
      });

      setTimeout(() => {
        sendMessage({
          type: "SEND_LOCATION",
          payload: {
            userId: "1a",
            roomId: "202A",
            position: { lat: 22.4965, lng: 88.3698 },
          },
        });
      }, 5000);

      setTimeout(() => {
        sendMessage({
          type: "SEND_LOCATION",
          payload: {
            userId: "1b",
            roomId: "202A",
            position: { lat: 22.5726, lng: 88.3639 },
          },
        });
      }, 7500);

      setTimeout(() => {
        sendMessage({
          type: "SEND_LOCATION",
          payload: {
            userId: "1c",
            roomId: "202A",
            position: { lat: 22.5752, lng: 88.3686 },
          },
        });
      }, 11000);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        // This is called when the WebSocket connection is established
        // console.log("WebSocket connection established from client side");
        socketCommunication();
      };
    }
  }, [socket]);

  return isLoaded ? (
    <>
      <div className="complete-container">
        <div className="map-container">
          <div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentCenter}
              zoom={12}
            >
              {/* Current Location  */}
              <Marker position={{ lat: location.lat, lng: location.lng }} />

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
