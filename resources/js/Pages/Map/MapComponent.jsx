import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Ensure Leaflet styles are included
import 'leaflet-draw/dist/leaflet.draw.css'; // Include Leaflet.draw styles
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function MapComponent({ buildings }) {
    const mapRef = useRef(null); // Use useRef to hold the map instance
    const [map, setMap] = useState(null);

    // Set up map instance when it's created
    const handleMapCreated = (mapInstance) => {
        mapRef.current = mapInstance;  // Store map instance
        setMap(mapInstance);
    };

    useEffect(() => {
        if (map) {
            // Center map to the first building location by default
            const firstBuilding = buildings[0];
            map.setView([firstBuilding.latitude, firstBuilding.longitude], 12);
        }
    }, [map, buildings]);

    useEffect(() => {
        if (map) {
            const drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems
                }
            });

            map.addControl(drawControl);

            map.on('draw:created', (e) => {
                const layer = e.layer;
                drawnItems.addLayer(layer);
            });
        }
    }, [map]);

    // Generate markers for each building
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
        <AuthenticatedLayout>
            <div className="p-4">
                <h1>Boarding Houses Map</h1>
                <MapContainer
                    center={[10.252408750072465, 124.98452354763593]} // Default center
                    zoom={17}
                    whenCreated={handleMapCreated} // Store the map instance when it's created
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    {buildingMarkers}
                </MapContainer>
            </div>
        </AuthenticatedLayout>
    );
}
