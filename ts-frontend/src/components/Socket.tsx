import { useEffect, useState } from "react";
import Loader from "./Loader";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../styles/Map.css";

interface Location {
  lat: number;
  lng: number;
}

export const Socket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);

  const BASE_WS_URI = import.meta.env.VITE_WS_URI;

  const containerStyle = {
    width: "60vw",
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

  useEffect(() => {
    const newSocket = new WebSocket(BASE_WS_URI);
    newSocket.onopen = () => {
      console.log("Connection established from Client");
      newSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Manas",
            userId: "1a",
            roomId: "202A",
          },
        }),
      );
      newSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Manasi",
            userId: "1b",
            roomId: "202A",
          },
        }),
      );
      newSocket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: {
            name: "Sanam",
            userId: "1c",
            roomId: "202A",
          },
        }),
      );
      newSocket.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            userId: "1a",
            roomId: "202A",
            message: "Hello from WS Client!",
          },
        }),
      );

      //-----------------------
      newSocket.send(
        JSON.stringify({
          type: "SEND_LOCATION",
          payload: {
            userId: "1a",
            roomId: "202A",
            position: { lat: 22.4965, lng: 88.3698 },
          },
        }),
      );

      newSocket.send(
        JSON.stringify({
          type: "SEND_LOCATION",
          payload: {
            userId: "1b",
            roomId: "202A",
            position: { lat: 22.5726, lng: 88.3639 },
          },
        }),
      );

      newSocket.send(
        JSON.stringify({
          type: "SEND_LOCATION",
          payload: {
            userId: "1c",
            roomId: "202A",
            position: { lat: 22.5752, lng: 88.3686 },
          },
        }),
      );
      //-----------------------
      newSocket.onmessage = (message) => {
        console.log("Message received:", message.data);
        const jsonMessage = JSON.parse(message.data);
        const userId = jsonMessage.payload?.userId;
        const roomId = jsonMessage.payload?.roomId;
        const userMessage = jsonMessage.payload?.message;
        const receivedLocationLat: number = jsonMessage.payload?.position?.lat;
        const receivedLocationLng: number = jsonMessage.payload?.position?.lng;
        const receivedLocation: Location = {
          lat: receivedLocationLat,
          lng: receivedLocationLng,
        };
        setLatestMessage(
          `USER = ${userId}, from ROOM = ${roomId}, says: ${userMessage}`,
        );
        console.log("RECEIVED MSG: ", userId, roomId, userMessage);
        console.log(
          "RECEIVED LOC SEP: ",
          receivedLocationLat,
          receivedLocationLng,
        );
        console.log("RECEIVED LOC: ", receivedLocation);
        setLocations((prevLocations) => [...prevLocations, receivedLocation]);
        console.log("ALL LOCS: ", locations);
      };
    };
    setSocket(newSocket);

    //-------------------------------

    {
      locations.map((loc, index) =>
        console.log("DEBUG LOC : ", loc.lat, loc.lng, index),
        // <Marker
        //   key={index} // Remember to provide a unique key for each Marker component
        //   position={{ lat: location.lat, lng: location.lng }}
        // />
      );
    }

    //-------------------------------
    return () => {
      newSocket.close();
    };
  }, [locations]);

  useEffect(() => {
    console.log("DIFF ALL LOCS: ", locations);
  }, [locations]);

  return isLoaded ? (
    <>
      <div className="complete-container">
        <div className="map-container">
          <div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentCenter}
              zoom={18.25}
            >
              {/* Current Location  */}
              <Marker position={{ lat: location.lat, lng: location.lng }} />

              {/* <Marker position={{ lat: 22.4965, lng: 88.3698 }} />
          
              
                  <Marker position={{ lat: 22.5726, lng: 88.3639 }} />
          
             
                  <Marker position={{ lat: 22.5752, lng: 88.3686 }} /> */}
            </GoogleMap>
          </div>
        </div>
      </div>

      {socket ? <h1>{latestMessage}</h1> : <Loader />}

      {/* {
  locations.length > 0 && locations.map((loc, index) => (
    (loc.lat !== undefined && loc.lng !== undefined) && (
      <h1 key={index}> {`lat: ${loc.lat}, lng: ${loc.lng}, index: ${index}`} </h1>
    )
  ))
} */}
    </>
  ) : (
    <></>
  );
};
