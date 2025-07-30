import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Head, Link, useForm } from '@inertiajs/react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import polyline from '@mapbox/polyline';
import axios from 'axios';
import AuthenticatedLayout from '../../../AuthenticatedLayout';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const containerStyle = {
  width: '100%',
  height: '500px',
};

export default function RouteMap({ building }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null); // Reference to the Mapbox Draw instance
  const [route, setRoute] = useState(null);
      const [routes, setRoutes] = useState(building.routes); // State to hold existing routes
  const [isRouteSaved, setIsRouteSaved] = useState(false);
  const routeLayerIds = useRef([]); // Initialize routeLayerIds to keep track of added layers and sources
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [category, setCategory] = useState('school');
  const [destination, setDestination] = useState(null); // clicked map location
  const [destinationInfo, setDestinationInfo] = useState({
    name: '',
    description: '',
    image: '',
  });
  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Initialize Mapbox map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0], // Default center, will update once we get the building's location
      zoom: 14,
    });

    // Wait for the map to fully load
    map.current.on('load', () => {
      // Initialize Mapbox Draw tool
      draw.current = new MapboxDraw({
        displayControlsDefault: true, // We can enable or disable specific controls
        controls: {
          line_string: true,  // Allow drawing lines (routes)
          trash: true,        // Enable trash button to delete drawn features
        },
      });

      map.current.addControl(draw.current);
      map.current.addControl(new mapboxgl.NavigationControl()); // For zoom and rotation controls

      // Center map on building location once data is available
      if (building) {
        console.log('Building data:', building);
        map.current.flyTo({
          center: [building.longitude, building.latitude], // Use building's longitude and latitude
          zoom: 17,
        });

        // Add marker for the building location
        new mapboxgl.Marker()
          .setLngLat([building.longitude, building.latitude])
          .setPopup(new mapboxgl.Popup().setText(`Building: ${building.name}`))
          .addTo(map.current);

        // Display existing routes on the map
        building.routes.forEach((route, idx) => {
          const sourceId = `route-source-${idx}`;
          const layerId = `route-layer-${idx}`;
          console.log('Adding route:', route.coordinates);
          map.current.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: route.coordinates,
              },
            },
          });

          map.current.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#ff0000',
              'line-width': 5,
              'line-opacity': 1,
            },
          });

          // Push the layer and source ids into the routeLayerIds array
          routeLayerIds.current.push(layerId);
          routeLayerIds.current.push(sourceId);

        });
        // Inside your map's onLoad function, after adding the existing routes
        building.routes.forEach((routeData, idx) => {
          if (routeData.coordinates && routeData.coordinates.length > 0) {
            const lastCoordinate = routeData.coordinates[routeData.coordinates.length - 1]; // Last coordinate
            const [lastLng, lastLat] = lastCoordinate; // Extract latitude and longitude

            // Add marker for the last point (destination)
            new mapboxgl.Marker()
              .setLngLat([lastLng, lastLat])
              .setPopup(new mapboxgl.Popup().setText(`Destination: ${building.name}`)) // Set the popup text to the destination name
              .addTo(map.current); // Add the marker to the map
          }
        });

      }
    });

    // Handle map click event to set destination
    map.current.on('click', (e) => {
      if (!routeCoordinates) return; // Only allow if route has been drawn

      setDestination({
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      });

      new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setPopup(new mapboxgl.Popup().setText("Selected Destination"))
        .addTo(map.current);
    });
    // Listen for drawing completion
    map.current.on('draw.create', (e) => {
      const coords = e.features[0].geometry.coordinates;
      setRouteCoordinates(coords);
    });

    const handleResize = () => {
      map.current.resize();  // Manually trigger resize to update the map's size
    };
    window.addEventListener('resize', handleResize);  // Listen for resize events
    return () => {
      window.removeEventListener('resize', handleResize);  // Cleanup the event listener
    };
  }, [building]);

  // Function to save the drawn route to the backend
  const saveRouteToBackend = (routeCoordinates) => {
    axios.post('/admin/route/save', {
      buildingId: building.id,
      routeCoordinates: routeCoordinates,
    })
      .then((response) => {
        setIsRouteSaved(true);
        console.log('Route saved:', response.data); // Access response data directly
      })
      .catch((error) => {
        console.error('Error saving route:', error);
      });
  };

  // Fetch route from Mapbox Directions API
  const getRoute = (startLng, startLat, endLng, endLat) => {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${mapboxgl.accessToken}`;

    fetch(directionsUrl)
      .then((response) => response.json())
      .then((data) => {
        const encodedGeometry = data.routes[0]?.geometry; // Encoded polyline string
        if (!encodedGeometry) {
          console.error("Route geometry not found");
          return;
        }

        // Decode the polyline string into coordinates
        const routeCoordinates = polyline.decode(encodedGeometry);
        // Check if the source "route" already exists and remove it
        if (map.current.getSource('route')) {
          map.current.removeLayer('route-layer'); // Remove the layer first
          map.current.removeSource('route'); // Then remove the source
        }

        setRoute(routeCoordinates);
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates,
            },
          },
        });

        map.current.addLayer({
          id: 'route-layer',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ff0000',
            'line-width': 10,
            'line-opacity': 1,
          },
        });
      })
      .catch((error) => {
        console.log('Error getting route:', error);
      });
  };

  const handleSaveRoute = () => {
    if (!routeCoordinates || !destination || !destinationInfo.name) {
      alert("Please draw a route and click the destination on the map.");
      return;
    }

    axios.post('/admin/route/save', {
      buildingId: building.id,
      routeCoordinates,
      category,
      destination: {
        name: destinationInfo.name,
        latitude: destination.lat,
        longitude: destination.lng,
        image: destinationInfo.image,
        description: destinationInfo.description,
      },
    }).then(res => {
      alert("Route saved!");
      // Reset all
      setRouteCoordinates(null);
      setDestination(null);
      setDestinationInfo({ name: '', description: '', image: '' });
    }).catch(err => {
      console.error(err);
      alert("Error saving route.");
    });
  };

  const handleCancelRoute = () => {
    // Optionally clear the route if the admin decides not to save it
    setRoute(null);
  };

  const handleDeleteRoute = (routeId) => {
    // Delete route from backend
    axios.delete(`/admin/route/delete/${routeId}`)
      .then((response) => {
        // Remove route from the map
        map.current.removeLayer(`existing-route-layer-${routeId}`);
        map.current.removeSource(`existing-route-${routeId}`);
        console.log(`Route with ID ${routeId} deleted.`);
      })
      .catch((error) => {
        console.error('Error deleting route:', error);
      });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Route Map" />
      {/* Map Container */}
      <div className="flex-1 h-full">
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      </div>

      {routeCoordinates && destination && (
        <div className="mt-4 bg-white p-4 rounded shadow-md space-y-4">
          <h3 className="text-lg font-bold">Route Details</h3>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Destination Name"
            value={destinationInfo.name}
            onChange={(e) => setDestinationInfo({ ...destinationInfo, name: e.target.value })}
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            value={destinationInfo.description}
            onChange={(e) => setDestinationInfo({ ...destinationInfo, description: e.target.value })}
          />
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Image URL (optional)"
            value={destinationInfo.image}
            onChange={(e) => setDestinationInfo({ ...destinationInfo, image: e.target.value })}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="school">School</option>
            <option value="eatery">Eatery</option>
            <option value="school_supply">School Supply</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={handleSaveRoute}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Route
          </button>
        </div>
      )}
      <div className="mt-4">
        {route && !isRouteSaved && (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Do you want to save this route?</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleSaveRoute}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Save Route
              </button>
              <button
                onClick={handleCancelRoute}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {isRouteSaved && (
          <p className="mt-4 text-green-600 font-semibold">Route saved successfully!</p>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
