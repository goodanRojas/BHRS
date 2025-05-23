import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  
import 'leaflet-draw/dist/leaflet.draw.css'; // Include Leaflet.draw styles

export default function AdminMapComponent({ buildings, saveRoute }) {
    const mapRef = useRef(null);
    const [routePath, setRoutePath] = useState([]);

    // Handle the map creation and setting up the drawing tool
    const handleMapCreated = (mapInstance) => {
        mapRef.current = mapInstance;

        const drawnItems = new L.FeatureGroup();
        mapInstance.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems
            }
        });
        mapInstance.addControl(drawControl);

        mapInstance.on('draw:created', (e) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);

            // Store the drawn route's path
            const path = layer.getLatLngs().map(latLng => [latLng.lat, latLng.lng]);
            setRoutePath(path);
        });
    };

    // Handle form submission to save the route
    const handleSaveRoute = () => {
        if (routePath.length === 0) {
            alert("Please draw a route first!");
            return;
        }

        // Prepare the route data to send to the backend
        const routeData = {
            name: "Route from Boarding House A to B", // Add a name or description for the route
            start_building_id: 1, // Set the actual building ID from which the route starts
            end_building_id: 2, // Set the actual building ID where the route ends
            path: routePath,
        };

        // Call the saveRoute function passed from the parent component (via props)
        saveRoute(routeData);
    };

    return (
        <div>
            <h1>Admin Map - Draw and Save Route</h1>
            <MapContainer
                center={[57.796078, 88.739419]} // Default center
                zoom={12}
                whenCreated={handleMapCreated}
                style={{ height: "500px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                {/* Render buildings */}
                {buildings.map(building => (
                    <Marker key={building.id} position={[building.latitude, building.longitude]}>
                        <Popup>
                            <div>
                                <img src={`/storage/${building.image}`} alt={building.name} width="100" />
                                <h4>{building.name}</h4>
                                <p>{building.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <button onClick={handleSaveRoute}>Save Route</button>
        </div>
    );
}
