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
  // console.log('Buildings:', buildings);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [popup, setPopup] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const debounceTimeout = useRef(null);

  // To track route layer and source ids for cleanup
  const routeLayerIds = useRef([]);

  // To track spiderfied DOM markers for cleanup
  const spiderfiedMarkers = useRef({});

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
      navigator.geolocation.getCurrentPosition(
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
      features: buildings.map((b) => {
        // Check if b.address exists and is not null
        const address = b.address || {};
        const owner = b.seller || {};
        const users = b.rooms?.flatMap(room =>
          room.beds?.flatMap(bed =>
            bed.bookings?.map(booking => ({
              ...booking.user,
              created_at: booking.created_at // assuming you loaded booking.created_at
            })) || []
          ) || []
        ) || [];

        // Remove null users (in case)
        const filteredUsers = users.filter(user => user && user.id);
        // Sort by latest (assuming created_at exists)
        filteredUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Get first user and count of the rest
        const firstTenant = filteredUsers[0];
        const restCount = Math.max(filteredUsers.length - 1, 0);
        const displayCount = restCount > 9 ? '9+' : `+${restCount}`;

        return {
          type: 'Feature',
          properties: {
            id: b.id,
            name: b.name,
            image: b.image,
            address: {
              street: address.street || '',
              barangay: address.barangay || '',
              city: address.city || '',
              province: address.province || '',
              postal_code: address.postal_code || '',
              country: address.country || '',
            },
            owner: {
              id: owner.id,
              avatar: owner.avatar,
              name: owner.name,
            },
            tenants: {
              first: firstTenant || null,
              count: restCount > 0 ? displayCount : null,
            },
            rating: b.rating,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(b.longitude || '0'),  // Default to 0 if missing
              parseFloat(b.latitude || '0'),   // Default to 0 if missing
            ],
          },
        };
      }),
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
      const features = map.current.querySourceFeatures('buildings', {
        filter: ['!', ['has', 'point_count']],
      });

      features.forEach((feature) => {
        const id = feature.properties.id;
        const coordinates = feature.geometry.coordinates;

        if (spiderfiedMarkers.current[id]) {
          return;
        }

        const el = document.createElement('div');
        el.className = 'group relative flex flex-col items-center text-center cursor-pointer';

        // Wrapper for image
        const imgWrapper = document.createElement('div');
        imgWrapper.style.width = '40px';
        imgWrapper.style.height = '40px';
        imgWrapper.style.borderRadius = '5px';
        imgWrapper.style.overflow = 'hidden';
        imgWrapper.style.border = '2px solid white';
        imgWrapper.style.boxShadow = '0 0 2px rgba(0,0,0,0.5)';
        imgWrapper.style.backgroundColor = 'white';

        const img = document.createElement('img');
        img.src = `/storage/${feature.properties.image}`;
        img.alt = feature.properties.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        imgWrapper.appendChild(img);
        el.appendChild(imgWrapper);

        // Boarding house name (always visible)
        const nameDiv = document.createElement('div');
        nameDiv.innerText = feature.properties.name;
        nameDiv.style.marginTop = '2px';
        nameDiv.style.fontSize = '10px';
        nameDiv.style.background = 'white';
        nameDiv.style.padding = '2px 4px';
        nameDiv.style.borderRadius = '4px';
        nameDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
        nameDiv.style.whiteSpace = 'nowrap';
        nameDiv.style.maxWidth = '80px';
        nameDiv.style.overflow = 'hidden';
        nameDiv.style.textOverflow = 'ellipsis';
        el.appendChild(nameDiv);

        // Rating (only on hover)
        const ratingDiv = document.createElement('div');
        const rating = feature.properties.rating ?? 'N/A';
        ratingDiv.innerHTML = `⭐ ${typeof rating === 'number' ? rating.toFixed(1) : rating}`;
        ratingDiv.style.position = 'absolute';
        ratingDiv.style.top = '100%';
        ratingDiv.style.marginTop = '4px';
        ratingDiv.style.fontSize = '10px';
        ratingDiv.style.padding = '2px 4px';
        ratingDiv.style.background = 'white';
        ratingDiv.style.borderRadius = '4px';
        ratingDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
        ratingDiv.style.display = 'none';
        el.appendChild(ratingDiv);

        // Hover handlers
        el.addEventListener('mouseenter', () => {
          ratingDiv.style.display = 'block';
        });
        el.addEventListener('mouseleave', () => {
          ratingDiv.style.display = 'none';
        });

        // Add to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .addTo(map.current);

        // On click show popup
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          closePopup();
          clearRoutes();
          const address = JSON.parse(feature.properties.address ?? '{}');
          const formattedAddress = `${address.street}, ${address.barangay}`;


          const newPopup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`
              <div style="max-width: 240px; font-family: Arial, sans-serif; padding: 12px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 16px; margin-bottom: 8px; color: #333;">${feature.properties.name}</h3>
                  <img src="/storage/${feature.properties.image}" alt="${feature.properties.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;" />
                  <p style="font-size: 14px; margin: 4px 0; color: #555;"><strong>Street:</strong> ${formattedAddress}</p>
                  <p style="font-size: 14px; margin: 4px 0; color: #555;"><strong>Rating:</strong> ${feature.properties.rating ?? 'N/A'}</p>
              </div>
            `)
            .addTo(map.current);

          setPopup(newPopup);
        });

        spiderfiedMarkers.current[id] = marker;
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
      map.current.on('move', () => {
        const bounds = map.current.getBounds();
        Object.values(spiderfiedMarkers.current).forEach((marker) => {
          const isVisible = bounds.contains(marker.getLngLat());
          marker.getElement().style.display = isVisible ? 'block' : 'none';
        });
      });
      // Add initial DOM markers for unclustered points
      addDomMarkers();

    });

    map.current.on('click', 'clusters', (e) => {
      closePopup();
      clearRoutes();
      clearSpiderfy();

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });

      if (!features.length) return;

      const clusterId = features[0].properties.cluster_id;
      const source = map.current.getSource('buildings');

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        const coordinates = features[0].geometry.coordinates;
        map.current.easeTo({
          center: coordinates,
          zoom: zoom,
          duration: 500,
        });
        setTimeout(() => {
          addDomMarkers();
        }, 600);
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
    });

    // Optional: update DOM markers on map move end to handle new data/visibility
    map.current.on('moveend', () => {

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        addDomMarkers();
      }, 200);
    });
  }, [buildings, popup]);

  return (
    <AuthenticatedLayout>
      <Head title="Map" />
      <div ref={mapContainer} style={containerStyle} />
    </AuthenticatedLayout>
  );
}
