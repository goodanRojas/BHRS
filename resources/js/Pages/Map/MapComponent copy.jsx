import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Ensure Leaflet styles are included

export default function MapComponent({ buildings }) {
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map) {
            // Center map to the first building location by default
            const firstBuilding = buildings[0];
            map.setView([firstBuilding.latitude, firstBuilding.longitude], 12);
        }
    }, [map, buildings]);

    const buildingMarkers = buildings.map((building) => {
        const { id, name, image, latitude, longitude } = building;

        const customIcon = L.icon({
            iconUrl: `/storage/${image}`, // Assuming the image is stored in public storage
            iconSize: [50, 50],
        });

        return (
            <Marker key={id} position={[latitude, longitude]} icon={customIcon}>
                <Popup>
                    <div>
                        <img src={`/storage/${image}`} alt={name} width="100" />
                        <h4>{name}</h4>
                        <p>Rating: 4.5</p> {/* You can dynamically add rating */}
                        <p>{building.address}</p>
                    </div>
                </Popup>
            </Marker>
        );
    });

    return (
        <div>
            <h1>Boarding Houses Map</h1>
            <MapContainer
                center={[10.251642314554827, 124.98413411232256]} // Default center
                zoom={12}
                whenCreated={setMap} // Set map instance
                style={{ height: "500px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                {buildingMarkers}
            </MapContainer>
        </div>
    );
}
