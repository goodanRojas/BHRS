import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Head } from '@inertiajs/react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function MapBox({ buildings }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeLayerIds = useRef([]);
  const domMarkers = useRef([]);
  const currentPopup = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const selectedBuildingRef = useRef(null);

  const [activeBuildingId, setActiveBuildingId] = useState(null);

  useEffect(() => {
    if (map.current) return; // Prevent multiple initializations

    const savedView = JSON.parse(localStorage.getItem('lastMapView'));
    // Initialize the map with a default center (e.g., Manila)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: savedView ? [savedView.lng, savedView.lat] : [124.98565169929262, 10.250049903257633], // Manila as fallback center
      zoom: savedView ? savedView.zoom : 12,
    });

    // Try to get user's current location
    if (navigator.geolocation && !savedView) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Move the map to the user's location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });

          // Optional: Add marker at user location
          new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        }
      );
    }


  }, [buildings]);

  // Add buildings and clustering

  useEffect(() => {
    if (!map.current || !buildings.length) {
      return;
    }

    map.current.on('load', () => {

      const geojson = {
        type: 'FeatureCollection',
        features: buildings.map((b) => ({
          type: 'Feature',
          properties: {
            id: b.id,
            name: b.name,
            image: b.image,
            rating: b.feedback.length > 0
              ? (b.feedback.reduce((sum, f) => sum + f.rating, 0) / b.feedback.length).toFixed(1)
              : "No rating",
            owner: b.seller?.name || "Unknown",
          },
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(b.longitude), parseFloat(b.latitude)],
          },
        })),
      };

      if (map.current.getSource('buildings')) {
        map.current.getSource('buildings').setData(geojson);
        return;
      }

      // Add the buildings data to be used later for clustering
      map.current.addSource('buildings', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add layers for clustered and unclustered points
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'buildings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': 20,
          'circle-opacity': 0.8,
        },
      });

      // Number of points in each cluster
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'buildings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
        },
      });
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'buildings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#f59e0b', // Orange color for unclustered points
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });


      /* // Optional: Remove the symbol layer if it exists
      if (map.current.getLayer('unclustered-point')) {
        map.current.removeLayer('unclustered-point');
      } */

      // Loop through buildings (unclustered ones only)
      buildings.forEach((b) => {
        // Create the DOM element for your custom marker
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row'; // horizontal layout
        container.style.alignItems = 'center';
        container.style.background = 'white';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '9999px'; // pill shape
        container.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';
        container.style.padding = '2px 6px';
        container.style.paddingTop = '10px'; // adjust padding for better alignment
        container.style.gap = '6px'; // spacing between image and label
        container.style.cursor = 'pointer';


        // Marker element (image)
        const el = document.createElement('div');
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '9999px';
        el.style.backgroundImage = `url(/storage/${b.image})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.flexShrink = '0';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 3px rgba(0,0,0,0.2)';


        // Label element (building name)
        const label = document.createElement('div');
        label.textContent = b.name;
        label.style.fontSize = '13px';
        label.style.color = '#000';
        label.style.whiteSpace = 'nowrap';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.maxWidth = '120px'; // optional: limit width for long names

        // Append to container
        container.appendChild(el);
        container.appendChild(label);


        // Add the marker to the map
        const marker = new mapboxgl.Marker({
          element: container,
          anchor: 'top', // Adjust anchor to align with the bottom of the image
        })
          .setLngLat([parseFloat(b.longitude), parseFloat(b.latitude)])
          .addTo(map.current);

        domMarkers.current.push({ marker, building: b });

      });


      map.current.on('click', 'clusters', (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        map.current.getSource('buildings').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom,
              duration: 1000,
            });
          }
        );
      });

      map.current.on('click', 'unclustered-point', (e) => {
        const coords = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;
        const building = buildings.find((b) => b.id === parseInt(props.id));
        console.log('Clicked building:', building);
        const html = `
        <div  class="p-2">
          <img src="/storage/${props.image}" class="rounded-lg w-full h-28 object-cover mb-2" />
          <h3 class="text-md font-bold">${props.name}</h3>
          <p class="text-sm text-gray-600">Owner: ${props.owner}</p>
          <p class="text-sm text-yellow-500">Rating: ${props.rating} ⭐</p>
        </div>
      `;

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(html)
          .addTo(map.current);
        showBuildingRoutes(building);
      });

      map.current.on('click', (e) => {
        // Close popup only if clicking blank space
        const features = map.current.queryRenderedFeatures(e.point);
        if (features.length === 0) {
          clearMapOverlays();
          setActiveBuildingId(null);
        }

      });

      map.current.on('mouseenter', 'clusters', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'clusters', () => {
        map.current.getCanvas().style.cursor = '';
      });

      map.current.on('zoom', () => {
        const zoom = map.current.getZoom();
        const showMarkers = zoom >= 14; // Customize threshold if needed

        domMarkers.current.forEach(({ marker }) => {
          if (marker && typeof marker.getElement === 'function') {
            marker.getElement().style.display = showMarkers ? 'block' : 'none';
          }
        });

      });

      map.current.on('moveend', () => {
        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        localStorage.setItem('lastMapView', JSON.stringify({
          lng: center.lng,
          lat: center.lat,
          zoom,
        }));

      });

    });
  }, [buildings]);

  const showBuildingRoutes = (building) => {
    // Clean up previous routes
    routeLayerIds.current.forEach((id) => {
      if (map.current.getLayer(id)) map.current.removeLayer(id);
      if (map.current.getSource(id)) map.current.removeSource(id);
    });
    routeLayerIds.current = [];

    building.routes.forEach((route, index) => {
      const coordinates = JSON.parse(route.coordinates).map((pt) => [
        parseFloat(pt.lng),
        parseFloat(pt.lat),
      ]);

      const id = `route-${building.id}-${index}`;

      map.current.addSource(id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      });

      map.current.addLayer({
        id,
        type: 'line', //Change to dashed line when the route is clicked or the distination is clicked
        source: id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6', // Blue color
          'line-width': 4,
          'line-dasharray': [1, 0], // Dashed line
        },
      });

      routeLayerIds.current.push(id);

      // Destination marker
      const dest = route.destination;
      // console.log('Destination:', dest);
      // Create a custom DOM element for the marker + label
      const markerContainer = document.createElement('div');
      markerContainer.className = 'relative flex flex-col items-center group';

      // Marker circle (dot)
      const markerDot = document.createElement('div');
      markerDot.className = 'w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow';
      markerContainer.appendChild(markerDot);

      // Category label (always visible)
      const label = document.createElement('div');
      label.className = 'text-xs mt-1 bg-white px-2 py-1 rounded shadow text-gray-800 whitespace-nowrap';
      label.innerText = dest.category;
      markerContainer.appendChild(label);

      // 4. Create a popup
      const popup = new mapboxgl.Popup().setHTML(`
        <div class="text-sm">
          <strong>${dest.name}</strong><br/>
          <img src="/storage/${dest.image}" class="rounded w-full h-20 object-cover my-1"/>
          <span class="text-gray-500">${dest.category}</span>
        </div>
      `);

      // 5. Create the marker with the DOM element
      const destinationMarker = new mapboxgl.Marker({ element: markerContainer })
        .setLngLat([parseFloat(dest.longitude), parseFloat(dest.latitude)])
        .setPopup(popup)
        .addTo(map.current);

      // Highlight the route when the marker is clicked
      destinationMarker.getElement().addEventListener('click', () => {
        const matchingRoute = building.routes.find(r => r.destination_id === dest.id);

        if (matchingRoute) {
          const routeIndex = building.routes.indexOf(matchingRoute);
          const layerId = `route-${building.id}-${routeIndex}`;
          highlightRoute(layerId);
        } else {
          console.warn('No matching route found for destination:', dest.id);
        }
      });

      // 6. Toggle label on popup open/close
      popup.on('open', () => {
        label.style.display = 'none';
      });

      popup.on('close', () => {
        label.style.display = 'block';
      });


      // Save this destination marker for later cleanup
      domMarkers.current.push({ destinationMarker });

    });
  };

  const clearMapOverlays = () => {
    // Remove popup
    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }

    // Remove all route lines
    routeLayerIds.current.forEach((id) => {
      if (map.current.getLayer(id)) map.current.removeLayer(id);
      if (map.current.getSource(id)) map.current.removeSource(id);
    });
    routeLayerIds.current = [];

    // Remove destination markers
    domMarkers.current.forEach(({ destinationMarker }) => {
      if (destinationMarker) destinationMarker.remove();
    });

    // Clean up destination markers from ref
    domMarkers.current = domMarkers.current.map((item) => ({
      ...item,
      destinationMarker: null,
    }));
  };
  const highlightRoute = (routeId) => {
    // First reset all other routes to default (optional if only one is active)
    routeLayerIds.current.forEach((id) => {
      if (!id) return; // Skip if id is undefined
      if (!map.current.getLayer(id)) return; // Skip if layer doesn't exist

      map.current.setPaintProperty(id, 'line-color', '#3b82f6'); // blue
      map.current.setPaintProperty(id, 'line-dasharray', [1, 0]); // solid
    });

    // Highlight the selected one
    map.current.setPaintProperty(routeId, 'line-color', '#f59e0b'); // orange
    map.current.setPaintProperty(routeId, 'line-dasharray', [2, 2]); // dashed
  };



  return (
    <AuthenticatedLayout>
      <Head title="Map" />

      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Explore Boarding Houses</h1>
        <div ref={mapContainer} className="w-full h-[80vh] rounded-lg shadow-md border" />
      </div>
    </AuthenticatedLayout>
  );
}