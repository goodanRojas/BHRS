import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Head } from '@inertiajs/react';
import ReactDOM from 'react-dom/client';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function MapBox({ buildings, destinations, focusId }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeLayerIds = useRef([]);
  const domMarkers = useRef([]);
  const currentPopup = useRef(null);
  useEffect(() => {
    if (map.current) return; // Prevent multiple initializations

    const savedView = JSON.parse(localStorage.getItem('lastMapView'));

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
      const destGeojson = {
        type: 'FeatureCollection',
        features: destinations.map((d) => ({
          type: 'Feature',
          properties: {
            name: d.name,
            image: d.image,
            category: d.category,
            description: d.description,
            latitude: d.latitude,
            longitude: d.longitude,
          },
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)],
          },
        })),
      };

      if (map.current.getSource('buildings')) {
        map.current.getSource('buildings').setData(geojson);
        return;
      }
      if (map.current.getSource('destinations')) {
        map.current.getSource('destinations').setData(destGeojson);
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
      // Add the destinations data to be used later for clustering
      map.current.addSource('destinations', {
        type: 'geojson',
        data: destGeojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
      // Add the dot for destinations
      map.current.addLayer({
        id: "destinations-points",
        type: "circle",
        source: "destinations",
        paint: {
          "circle-radius": 5,
          "circle-color": "#16a34a", // green
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff"
        }
      });
      //  Add the label text for destinations
      map.current.addLayer({
        id: "destinations-labels",
        type: "symbol",
        source: "destinations",
        layout: {
          "text-field": ["get", "category"], // use the property as label
          "text-size": 12,
          "text-offset": [0, 1.2], // move below/above the circle
          "text-anchor": "top"
        },
        paint: {
          "text-color": "#333333"
        }
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


      // Loop through buildings (unclustered ones only)
      buildings.forEach((b) => {
        // Create the DOM element for your custom marker
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row'; // horizontal layout
        container.style.alignItems = 'center';
        container.style.whiteSpace = 'nowrap'; // prevent text wrapping
        container.style.flexWrap = 'nowrap'; // prevent text wrapping
        container.style.maxWidth = "160px";
        container.style.overflow = 'hidden'; // hide overflow
        container.style.background = 'white';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '9999px'; // pill shape
        container.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';
        container.style.padding = '2px 6px';
        container.style.gap = '6px'; // spacing between image and label
        container.style.cursor = 'pointer';


        // Label element (building name)
        const label = document.createElement('div');
        label.textContent = b.name;
        label.style.fontSize = '10px';
        label.style.fontWeight = 'bold';
        label.style.color = '#000';
        label.style.whiteSpace = 'nowrap';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.maxWidth = '120px'; // optional: limit width for long names

        container.appendChild(label);


        // Add the marker to the map
        const marker = new mapboxgl.Marker({
          element: container,
          anchor: 'bottom', // Adjust anchor to align with the bottom of the image
          offset: [50, 35], // Adjust offset to position the marker above the image
        })
          .setLngLat([parseFloat(b.longitude), parseFloat(b.latitude)])
          .addTo(map.current);

        domMarkers.current.push({ marker, building: b });

      });

      //Loop through destinations (unclustered ones only)
      destinations.forEach((d) => {
        map.current.on('click', 'destinations-points', (e) => {
          const feature = e.features[0];

          // Create a fresh popup every click
          const popup = new mapboxgl.Popup({ closeButton: true, closeOnClick: true })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(`
        <div class="text-sm">
          <strong>${feature.properties.name}</strong><br/>
          <img src="/storage/${feature.properties.image}" class="rounded w-full h-20 object-cover my-1"/>
          <span class="text-gray-500">${feature.properties.category}</span>
        </div>
      `)
            .addTo(map.current);
        });

        map.current.on('mouseenter', 'destinations-points', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'destinations-points', () => {
          map.current.getCanvas().style.cursor = '';
        });
      });


      map.current.on('click', 'clusters',
        (e) => {
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
        const buildingId = parseInt(props.id);
        const building = buildings.find((b) => b.id === parseInt(buildingId));
        const targetMarker = domMarkers.current.find(
          ({ building: b }) => b.id === buildingId
        );

        const html = `
        <a href="/home/building/${buildingId}" class="flex flex-col items-center">
          <div  class="p-2">
              <img src="/storage/${props.image}" class="rounded-lg w-full h-28 object-cover mb-2" />
              <h3 class="text-md font-bold">${props.name}</h3>
              <p class="text-sm text-gray-600"> ${props.owner}</p>
              <p class="text-sm text-yellow-500">Rating: ${props.rating} ⭐</p>
          </div>
        </a>   
      `;

        const popup = new mapboxgl.Popup({
          offset: {
            'top': [0, 10],
            'bottom': [0, -30],
            'left': [10, 0],
            'right': [-10, 0]
          }
        })
          .setLngLat(coords)
          .setHTML(html)
          .addTo(map.current);

        if (targetMarker) {
          targetMarker.marker.getElement().style.display = 'none'; // Hide the marker when clicked\
          popup.on('close', () => {
            targetMarker.marker.getElement().style.display = 'flex'; // Hide the marker when clicked\

          });
        }
        showBuildingRoutes(building);
      });

      map.current.on('click', (e) => {
        // Close popup only if clicking blank space
        const features = map.current.queryRenderedFeatures(e.point);
        if (features.length === 0) {
          clearMapOverlays();
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
          'line-color': '#400bc7', // Blue color
          'line-width': 2,
          'line-dasharray': [1, 0], // Dashed line
        },
      });
      // 🔹 Listen for clicks on this route
      map.current.on('click', id, () => {
        highlightRoute(id);
      });
      routeLayerIds.current.push(id);
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
    // Hide all other routes
    routeLayerIds.current.forEach((id) => {
      if (!id) return;
      if (!map.current.getLayer(id)) return;

      if (id === routeId) {
        // Show and style the selected route
        map.current.setLayoutProperty(id, 'visibility', 'visible');
        map.current.setPaintProperty(id, 'line-color', '#f59e0b'); // orange
        map.current.setPaintProperty(id, 'line-dasharray', [2, 2]); // dashed
      } else {
        // Hide other routes
        map.current.setLayoutProperty(id, 'visibility', 'none');
      }
    });
  };


  // Focus on a building
  useEffect(() => {
    if (!map.current) return;
    if (!focusId) return;

    const targetBuilding = buildings.find(b => b.id === parseInt(focusId));
    if (targetBuilding) {
      map.current.flyTo({
        center: [parseFloat(targetBuilding.longitude), parseFloat(targetBuilding.latitude)],
        zoom: 18,
        essential: true
      });

    }
  }, [focusId, buildings]);

  return (
    <AuthenticatedLayout>
      <Head title="Map" />

      <div className="p-4">
        <div ref={mapContainer} className="w-full h-[80vh] rounded-lg shadow-md border" />
      </div>


    </AuthenticatedLayout>
  );
}



