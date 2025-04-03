import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';
const BoardingHouseMap = ({ boardingHouses }) => {
  const [mapCenter, setMapCenter] = useState([10.250839910058316, 124.98449325969413]); // Default to Manila (adjust as needed)
  const [zoomLevel, setZoomLevel] = useState(13);

  useEffect(() => {
    if (boardingHouses.length > 0) {
      // Adjust the map center and zoom based on the boarding house locations
      const latitudes = boardingHouses.map((bh) => bh.latitude);
      const longitudes = boardingHouses.map((bh) => bh.longitude);

      const lat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
      const lng = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;

      setMapCenter([lat, lng]);
      setZoomLevel(12);
    }
  }, [boardingHouses]);

  // Create a custom marker cluster group
  const createClusterCustomIcon = (cluster) => {
    return L.divIcon({
      html: `<div style="background: #4caf50; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 2px solid #388e3c;">
               <span>${cluster.getChildCount()}</span>
             </div>`,
      className: '', // Remove default styles if needed
      iconSize: L.point(40, 40, true),
    });
  };

  return (
    <MapContainer center={mapCenter} zoom={zoomLevel} style={{ width: '100%', height: '500px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {boardingHouses.map((boardingHouse, index) => (
          <Marker
            key={index}
            position={[boardingHouse.latitude, boardingHouse.longitude]}
            icon={new L.Icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <strong>{boardingHouse.name}</strong>
              <br />
              {boardingHouse.address}
              <br />
              <Link
                href={`/buildings/${boardingHouse.id}`}
                className="text-blue-500 underline hover:text-blue-700"
              >
                View Details
              </Link>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default BoardingHouseMap;
