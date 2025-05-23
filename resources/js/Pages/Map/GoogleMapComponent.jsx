import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsService } from '@react-google-maps/api';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 10.254998501257939,  // Default center latitude
  lng: 124.9837457283033,   // Default center longitude
};

const GoogleMapComponent = ({ buildings }) => {
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Request geolocation after user action
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDestination({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  // Prepare the markers (coordinates) for the map
  const markers = buildings.map((house) => ({
    id: house.id,
    lat: parseFloat(house.latitude),   // Ensure latitude is a number
    lng: parseFloat(house.longitude),  // Ensure longitude is a number
    address: house.address,
    name: house.name,
    image: house.image,
  }));

  const directionsCallback = (result, status) => {
    if (status === 'OK') {
      setDirections(result);
    } else {
      console.error(`Error fetching directions ${status}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <LoadScript googleMapsApiKey="AIzaSyAmh2-EW85lWv7Np2ZDK5KIWgVKaw8fAU0">
        <Head title="Map" />
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
          {/* Render markers */}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => setSelectedMarker(marker)} // Set the selected marker on click
            />
          ))}

          {/* InfoWindow to display the building details */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.lat,
                lng: selectedMarker.lng,
              }}
              onCloseClick={() => setSelectedMarker(null)} // Close InfoWindow on click
            >
              <Link href={`/home/building/${selectedMarker.id}`}>
                <div>
                  <img
                    src={`/storage/building/${selectedMarker.image}`} // Assuming image is stored in the correct path
                    alt={selectedMarker.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <h4>{selectedMarker.name}</h4>
                  <p><strong>Address:</strong> {selectedMarker.address}</p> {/* Display address */}
                </div>
              </Link>

            </InfoWindow>
          )}

          {/* Button to trigger geolocation */}
          <button onClick={getLocation} style={{ position: 'absolute', top: '20px', left: '20px' }}>
            Get My Location
          </button>

          {/* Directions Service */}
          <DirectionsService
            options={{
              origin: { lat: parseFloat(markers[0].lat), lng: parseFloat(markers[0].lng) },
              destination: destination || { lat: 0, lng: 0 }, // Ensure destination is valid
              travelMode: 'DRIVING',
            }}
            callback={directionsCallback}
          />
        </GoogleMap>
      </LoadScript>
    </AuthenticatedLayout>
  );
};

export default GoogleMapComponent;
