import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 14.5995, lng: 120.9842 }; // Manila, Philippines

const dummyBoardingHouses = [
  { id: 1, name: "Boarding House A", position: { lat: 14.6015, lng: 120.9860 } },
  { id: 2, name: "Boarding House B", position: { lat: 14.6030, lng: 120.9825 } },
  { id: 3, name: "Boarding House C", position: { lat: 14.5970, lng: 120.9880 } },
];

const GoogleMapComponent = () => {
  const [directions, setDirections] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (window.google) {
      // Add markers manually
      dummyBoardingHouses.forEach((house) => {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: house.position,
        });

        marker.addListener("click", () => handleMarkerClick(house));
      });
    }
  }, [map]);

  const handleMarkerClick = (house) => {
    setSelectedHouse(house);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        requestDirections(userLocation, house.position);
      });
    }
  };

  const requestDirections = (origin, destination) => {
    if (!window.google) {
      console.error("Google Maps API is not loaded");
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={["marker"]}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onLoad={(map) => setMap(map)}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
