import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
require("dotenv").config();

const containerStyle = {
    width: '70vw',
    height: '100vh' 
};

const center = {
    lat: 22.6405969,
    lng: 88.4145109
};

function Map() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.GOOGLE_API_KEY
    });

    const [currentCenter, setCurrentCenter] = useState({
        lat: 25.561083,
        lng: 88.412666,
    });
    const [location, setLocation] = useState({
        lat: 25.561083,
        lng: 88.412666,
    });


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentCenter((currentCenter) => ({
                    ...currentCenter,
                    lat: position.coords.latitude
                }));

                setCurrentCenter((currentCenter) => ({
                    ...currentCenter,
                    lng: position.coords.longitude
                }));
                setLocation((location) => ({
                    ...location,
                    lat: position.coords.latitude
                }));

                setLocation((location) => ({
                    ...location,
                    lng: position.coords.longitude
                }));
            });
        }
    }, []);

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentCenter}
            zoom={18.25}
        >
            <Marker position={{ lat: location.lat, lng: location.lng }} />
        </GoogleMap>
    ) : <></>
}
export default Map;