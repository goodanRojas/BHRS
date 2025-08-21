import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Head, Link, useForm } from '@inertiajs/react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import polyline from '@mapbox/polyline';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import AuthenticatedLayout from '../../../AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import Modal from '@/Components/Modal';
import { filter } from 'jszip';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;


export default function RouteMap({ building, destinations }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);
  const isContinuing = useRef(false);
  const routeCounter = useRef(building.routes.length || 0);
  const [routeCoordinates, setRouteCoordinates] = useState(null);

  const routeFeatures = useRef([]);
  const destinationMarkers = useRef([]);

  const currentFeatureId = useRef(null);
  const { data, setData, post, processing, errors, reset, transform } = useForm({
    buildingId: building.id,
    name: '',
    image: null,
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    routes: [],
  });

  const onSubmit = (e) => {
    e.preventDefault();

    transform((data) => ({
      ...data,
      routes: routeCoordinates.map(([lng, lat]) => ({ lat, lng })),
    }));
    post(route('admin.route.store'), {
      onSuccess: () => {
        reset();
        setRouteCoordinates(null);
        draw.current.deleteAll(); // optional: clear map after save
      },
    });
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once


    /* Create the map */
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [building.longitude, building.latitude], // Use building's longitude and latitude
      zoom: 17,
    });

    /* Add marker for the building */
    new mapboxgl.Marker()
      .setLngLat([building.longitude, building.latitude])
      .setPopup(new mapboxgl.Popup().setText(`Building: ${building.name}`)) // This displays the building info when the marker is clicked
      .addTo(map.current);

    // Add zoom and rotation controls
    map.current.addControl(new mapboxgl.NavigationControl()); // For zoom and rotation 

    // Enable dashed line drawing
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      styles: [
        {
          id: 'gl-draw-highlight-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'highlight', true]],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#f00',
            'line-dasharray': [2, 2],
            'line-width': 4,
          },
        },
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#22074e',
            'line-width': 2,
            'line-opacity': 0.8,
          },


        },
        {
          id: 'gl-draw-points',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#f00'
          }
        },

      ],
    });

    map.current.on('load', () => {

      map.current.addControl(draw.current);

      // draw.current.changeMode('draw_line_string');
      building.routes.forEach((route, index) => {
        const coords = JSON.parse(route.coordinates).map(({ lat, lng }) => [parseFloat(lng), parseFloat(lat)]);
        const id = draw.current.add({
          type: 'Feature',
          properties: {
            routeId: route.id || index, // Use route id if available, otherwise use index
            highlight: 'false',
          },
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
        })[0];
        routeFeatures.current.push(id);
      })
      map.current.addSource('destinations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: destinations.map(d => ({
            type: 'Feature',
            properties: {
              name: d.name,
              category: d.category,
              description: d.description,
              image: d.image
            },
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)]
            }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster circles
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'destinations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#7300ff',
          'circle-radius': 18
        }
      });
      // Cluster counts
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'destinations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#fff'
        }
      });

      // Unclustered points
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'destinations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#7300ff',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
      map.current.addLayer({
        id: 'unclustered-labels',
        type: 'symbol',
        source: 'destinations',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-offset': [1.2, 0], // move label beside marker
          'text-anchor': 'left'
        },
        paint: {
          'text-color': '#000'
        }
      });


    });



    map.current.on('click', (e) => {
      if (!map.current.getLayer('gl-draw-line')) {
        // The layer isn't ready yet — skip querying to avoid the error
        return;
      }
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['gl-draw-line'], // the regular lines
      });

      if (!features.length) return;

      const clicked = features[0];
      const featureId = clicked.id;

      if (!featureId) return;

      // Remove highlight from the previous feature
      if (highlightFeatureId && draw.current.get(highlightFeatureId)) {
        const prev = draw.current.get(highlightFeatureId);
        prev.properties.highlight = 'false';
        draw.current.add(prev);
      }

      // Highlight the new one
      const feature = draw.current.get(featureId);
      if (feature) {
        feature.properties.highlight = 'true';
        draw.current.add(feature);
        highlightFeatureId = featureId;
      }
    });



    map.current.on('draw.create', (e) => {
      const newFeature = e.features[0];
      let coords = newFeature.geometry.coordinates;

      const buildingCoord = [building.longitude, building.latitude];

      if (!isContinuing.current) {
        // Prevent duplicate if user clicked near building
        const same = JSON.stringify(coords[0]) === JSON.stringify(buildingCoord);
        if (!same) {
          coords = [buildingCoord, ...coords];
        }
      } else {
        // Get the last point of the existing line
        const existing = draw.current.get(currentFeatureId.current);
        if (existing) {
          const existingCoords = existing.geometry.coordinates;
          coords = [...existingCoords, ...coords];
          draw.current.delete(currentFeatureId.current);
        }
        isContinuing.current = false; // reset the flag
      }

      draw.current.delete(newFeature.id); // remove the drawn segment

      const id = draw.current.add({
        type: 'Feature',
        properties: {
          routeId: routeCounter.current++,
          highlight: 'false',
        },
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      })[0];


      currentFeatureId.current = id;
      setRouteCoordinates(coords);
      draw.current.changeMode('direct_select', { featureId: id });
    });


    map.current.on('draw.update', (e) => {
      const updatedCoords = e.features[0].geometry.coordinates;
      setRouteCoordinates(updatedCoords);
    });

    map.current.on('draw.delete', (e) => {
      console.log('delete');
      e.features.forEach((feature) => {
        const routeId = feature.properties.routeId;
        if (routeId) {
          axios.delete(`/admin/route/delete/${routeId}`)
            .then(() => {
              console.log(`Route ${routeId} deleted from DB`);
            })
            .catch((err) => {
              console.error('Error deleting route from DB:', err);
            });
        }

      });

    });
  }, [building]);

  return (
    <AuthenticatedLayout>
      <Head title="Route Map" />
      <div className='p-4'>
        <div ref={mapContainer} className='w-full h-[500px] rounded border'></div>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2 bg-white p-3 rounded shadow-md border border-gray-200">
        <button
          onClick={() => {
            // Hide all
            routeFeatures.current.forEach(id => draw.current.delete(id));
            destinationMarkers.current.forEach(marker => marker.remove());
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded"
        >
          Hide All Routes
        </button>

        <button
          onClick={() => {
            // Re-add all
            draw.current.deleteAll(); // clear all before re-adding

            routeFeatures.current = [];
            destinationMarkers.current = [];

            building.routes.forEach((route, index) => {
              const coords = JSON.parse(route.coordinates).map(({ lat, lng }) => [parseFloat(lng), parseFloat(lat)]);
              const id = draw.current.add({
                type: 'Feature',
                properties: {
                  routeId: index,
                  highlight: 'false',
                },
                geometry: {
                  type: 'LineString',
                  coordinates: coords,
                },
              })[0];

              routeFeatures.current.push(id);

              if (route.destination) {
                const { latitude, longitude, name, category, description, image } = route.destination;
                const marker = new mapboxgl.Marker({ color: '#f00' })
                  .setLngLat([parseFloat(longitude), parseFloat(latitude)])
                  .setPopup(new mapboxgl.Popup().setHTML(`<strong>${name}</strong><br />Category: ${category}`))
                  .addTo(map.current);
                destinationMarkers.current.push(marker); // You missed defining marker before
              }

            });
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded"
        >
          Show All Routes
        </button>
      </div>

      {/* Floating map buttons */}
      {routeCoordinates && (
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white p-3 rounded shadow-md border border-gray-200">
          {/* Save */}
          <button
            className="flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={(e) => {
              onSubmit(e);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>Save</span>
          </button>

          {/* Continue */}
          <button
            className="flex items-center gap-2 text-sm px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {

              isContinuing.current = true;
              draw.current.changeMode('draw_line_string');
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
            <span>Continue</span>
          </button>

          {/* Delete */}
          <button
            className="flex items-center gap-2 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              if (!currentFeatureId.current) return;

              draw.current.delete(currentFeatureId.current);
              setRouteCoordinates(null);
              currentFeatureId.current = null;
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Delete</span>
          </button>
        </div>)}



    </AuthenticatedLayout>
  );
}
