import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 14.5995, // Default center, e.g. Manila lat
  lng: 120.9842,
};

export default function BuildingsMap({ buildings }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // put your API key here
  });

  const [activeMarker, setActiveMarker] = useState(null);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <AuthenticatedLayout>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {buildings.map((building) => {
          const position = {
            lat: parseFloat(building.latitude),
            lng: parseFloat(building.longitude),
          };

          return (
            <Marker
              key={building.id}
              position={position}
              onClick={() => setActiveMarker(building.id)}
              onMouseOver={() => setActiveMarker(building.id)}
              onMouseOut={() => setActiveMarker(null)}
            >
              {activeMarker === building.id && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div style={{ maxWidth: '200px' }}>
                    <Link href={`/home/building/${building.id}`}>
                      <h3 className="font-bold">{building.name}</h3>
                      <img
                        src={`/storage/${building.image}`}
                        alt={building.name}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
                      />
                      <p>Rating: {building.rating ?? 'N/A'}</p>
                      <p>Location: {building.address || 'No address available'}</p>
                    </Link>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </AuthenticatedLayout>
  );
}
