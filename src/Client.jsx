
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";
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
    const [currentCenter, setCurrentCenter] = useState({lat: 25.561083, lng: 88.412665});

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_API_KEY,
    });

    useEffect(() => {
        // code 
        setUsername("Nandy_Magic");
        if (navigator.geolocation && latitude === null && longitude === null) {
            navigator.geolocation.getCurrentPosition(function (position) {

                // need to debugging 
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);

                // updating the center location
                setCurrentCenter(currentCenter => ({
                    ...currentCenter,
                    lat: position.coords.latitude
                }));
                setCurrentCenter(currentCenter => ({
                    ...currentCenter,
                    lng: position.coords.longitude
                }));
            })
        }
    }, [longitude, latitude]);

    return (<>
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
    </>);
}

export default Client;