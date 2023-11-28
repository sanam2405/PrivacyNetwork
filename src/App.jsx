import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "./App.css";
require("dotenv").config()

const apiKey = process.env.GOOGLE_MAP_API_KEY;

const App = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: 22.561083, lng: 88.412665 }), []);

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={14.25}
        >

          <Marker position={{ lat: 22.561083, lng: 88.412665 }} />
          <Marker position={{ lat: 22.561090, lng: 88.412665 }} />
          <Marker position={{ lat: 22.561076, lng: 88.412665 }} />

        </GoogleMap>


      )}
    </div>
  );
};

export default App;