import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Head } from '@inertiajs/react';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const containerStyle = {
  width: '100%',
  height: '500px',
};


export default function MapBox({ buildings }) {
  console.log('Buildings:', buildings);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [popup, setPopup] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // To track route layer and source ids for cleanup
  const routeLayerIds = useRef([]);

  // To track spiderfied DOM markers for cleanup
  const spiderfiedMarkers = useRef([]);

  useEffect(() => {
    if (map.current) return;

    // Initialize the Mapbox map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0], // Default center, will be updated once location is fetched
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Get user's current location and set the map's center
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          // console.log('User location:', position.coords);
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Center the map on the user's location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
          });

          // Add a marker for the user's location
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setText('You are here!'))
            .addTo(map.current);
        },
        (error) => {
          console.log('Error getting user location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }

    // Prepare GeoJSON features from buildings
    const geojson = {
      type: 'FeatureCollection',
      features: buildings.map((b) => ({
        type: 'Feature',
        properties: {
          id: b.id,
          name: b.name,
          image: b.image,
          address: b.address,
          rating: b.rating,
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(b.longitude), parseFloat(b.latitude)],
        },
      })),
    };

    // Helper: Close popup
    function closePopup() {
      if (popup) {
        popup.remove();
        setPopup(null);
      }
    }

    // Helper: Clear route layers and sources
    function clearRoutes() {
      routeLayerIds.current.forEach((id) => {
        if (map.current.getLayer(id)) map.current.removeLayer(id);
        if (map.current.getSource(id)) map.current.removeSource(id);
      });
      routeLayerIds.current = [];
    }

    // Helper: Remove spiderfied markers
    function clearSpiderfy() {
      spiderfiedMarkers.current.forEach((m) => m.remove());
      spiderfiedMarkers.current = [];
    }

    // Helper: Add DOM markers for unclustered points
    function addDomMarkers() {
      // Clear previous DOM markers first
      clearSpiderfy();

      const features = map.current.querySourceFeatures('buildings', {
        filter: ['!', ['has', 'point_count']],
      });

      features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates;
        console.log('Adding DOM marker for feature:', feature);
        const { id, image, name, address, rating } = feature.properties;

        const el = document.createElement('div');
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.borderRadius = '5px';
        el.style.overflow = 'hidden';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 2px rgba(0,0,0,0.5)';
        el.style.backgroundColor = 'white';

        const img = document.createElement('img');
        img.src = `/storage/${image}`;
        img.alt = name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        el.appendChild(img);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .addTo(map.current);

        el.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent map click event

          closePopup();
          clearRoutes();

          // Show popup for building
          const newPopup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`
              <div style="max-width:200px;">
                <h3>${name}</h3>
                <img src="/storage/${image}" alt="${name}" style="width:100%;height:100px;object-fit:cover;margin-bottom:8px;" />
                <p>Address: ${address || 'No address available'}</p>
                <p>Rating: ${rating ?? 'N/A'}</p>
              </div>
            `)
            .addTo(map.current);

          setPopup(newPopup);

          // Show routes for this building if any
          const buildingId = Number(id);
          const routes = buildings.find(b => b.id === buildingId)?.routes || [];
          routes.forEach((route, idx) => {
            const sourceId = `route-source-${buildingId}-${idx}`;
            const layerId = `route-layer-${buildingId}-${idx}`;

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
                'line-color': '#ff7e5f',
                'line-width': 4,
                'line-opacity': 0.8,
              },
            });

            routeLayerIds.current.push(layerId);
            routeLayerIds.current.push(sourceId);
          });
        });

        spiderfiedMarkers.current.push(marker);
      });
    }

    // Spiderfy cluster markers (spread in circle)
    function spiderfyCluster(features, clusterCenter) {
      clearSpiderfy();
      console.log(features);

      const spiderfyRadius = 70; // pixels
      const centerPoint = map.current.project(clusterCenter);

      const angleStep = (2 * Math.PI) / features.length;


      features.forEach((feature, i) => {
        const angle = i * angleStep;
        const offsetX = spiderfyRadius * Math.cos(angle);
        const offsetY = spiderfyRadius * Math.sin(angle);

        const newPoint = {
          x: centerPoint.x + offsetX,
          y: centerPoint.y + offsetY,
        };

        const newLngLat = map.current.unproject(newPoint);

        const { id, image, name, address, rating } = feature.properties;

        const el = document.createElement('div');
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.borderRadius = '5px';
        el.style.overflow = 'hidden';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 2px rgba(0,0,0,0.5)';
        el.style.backgroundColor = 'white';

        const img = document.createElement('img');
        img.src = `/storage/${image}`;
        img.alt = name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        el.appendChild(img);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(newLngLat)
          .addTo(map.current);

        el.addEventListener('click', (e) => {
          e.stopPropagation();

          closePopup();
          clearRoutes();

          // Popup for spiderfied marker
          const newPopup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(newLngLat)
            .setHTML(`
              <div style="max-width:200px;">
                <h3>${name}</h3>
                <img src="/storage/${image}" alt="${name}" style="width:100%;height:100px;object-fit:cover;margin-bottom:8px;" />
                <p>Address: ${address || 'No address available'}</p>
                <p>Rating: ${rating ?? 'N/A'}</p>
              </div>
            `)
            .addTo(map.current);

          setPopup(newPopup);

          // Show routes
          const buildingId = Number(id);
          const routes = buildings.find(b => b.id === buildingId)?.routes || [];
          routes.forEach((route, idx) => {
            const sourceId = `route-source-${buildingId}-${idx}`;
            const layerId = `route-layer-${buildingId}-${idx}`;

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
                'line-color': '#ff7e5f',
                'line-width': 4,
                'line-opacity': 0.8,
              },
            });

            routeLayerIds.current.push(layerId);
            routeLayerIds.current.push(sourceId);
          });
        });

        spiderfiedMarkers.current.push(marker);
      });
    }

    // Add GeoJSON source and cluster layers
    map.current.on('load', () => {
      map.current.addSource('buildings', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 40,
      });

      // Cluster circles
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'buildings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#ff7e5f',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10,
            20,
            30,
            25,
          ],
          'circle-opacity': 0.75,
        },
      });

      // Cluster count labels
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'buildings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#fff',
        },
      });

      // Invisible circle layer for unclustered points; actual markers are DOM elements
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'buildings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 0,
          'circle-opacity': 0,
        },
      });

      // Add initial DOM markers for unclustered points
      addDomMarkers();
    });

    // Cluster click: spiderfy cluster
    map.current.on('click', 'clusters', (e) => {
      closePopup();
      clearRoutes();
      clearSpiderfy();

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      if (!features.length) return;

      const clusterId = features[0].properties.cluster_id;
      const clusterCenter = features[0].geometry.coordinates;

      map.current.getSource('buildings').getClusterLeaves(clusterId, 100, 0, (err, leaves) => {
        if (err) return;
        spiderfyCluster(leaves, clusterCenter);
      });
    });

    // Map click anywhere else: close popups, routes, spiderfy but keep zoom/center
    map.current.on('click', (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters', 'unclustered-point'],
      });
      if (!features.length) {
        closePopup();
        clearRoutes();
        clearSpiderfy();
      }
    });

    // On zoom start: clear spiderfied markers and routes
    map.current.on('zoomstart', () => {
      closePopup();
      clearRoutes();
      clearSpiderfy();
    });

    // Optional: update DOM markers on map move end to handle new data/visibility
    map.current.on('moveend', () => {
      addDomMarkers();
    });
  }, [buildings, popup]);

  return (
    <AuthenticatedLayout>
      <Head title="Map" />
      <div ref={mapContainer} style={containerStyle} />
    </AuthenticatedLayout>
  );
}
