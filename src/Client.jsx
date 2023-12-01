import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";
require("dotenv").config();
// import { io } from 'socket.io-client';
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

const Client = () => {
  // const io = new Server({
  //     cors: {
  //       origin: "http://localhost:3000"
  //     }
  // });
  // io.listen(4000);

  const [username, setUsername] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [currentCenter, setCurrentCenter] = useState({
    lat: 25.561083,
    lng: 88.412665,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation && latitude === null && longitude === null) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // setting the current username
        setUsername("<a_generic_username>");

        // setting the current latitude and longitude of the user
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        // setting the current center location of the map
        setCurrentCenter((currentCenter) => ({
          ...currentCenter,
          lat: position.coords.latitude,
        }));

        setCurrentCenter((currentCenter) => ({
          ...currentCenter,
          lng: position.coords.longitude,
        }));
      });
    }
  }, [username, longitude, latitude]);

  return (
    <>
      <div className="App">
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={currentCenter}
            zoom={12.25}
          >
            <Marker position={{ lat: latitude, lng: longitude }} />
          </GoogleMap>
        )}
      </div>
    </>
  );
};

export default Client;
