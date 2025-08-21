import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../AuthenticatedLayout';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function MapDestination({ buildings, destinations }) {
    // console.log(destinations);
    // console.log(buildings);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const domMarkers = useRef([]);
    // Initialize map
    useEffect(() => {
        if (map.current) return;


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

    }, [buildings, destinations]);

    useEffect(() => {
        if (!map.current) return;

        map.current.on('load', () => {

            const destGeojson = {
                type: 'FeatureCollection',
                features: destinations.map((d) => ({
                    type: 'Feature',
                    properties: {
                        id: d.id,
                        name: d.name,
                        image: d.image,
                        category: d.category,
                        Description: d.description,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)],
                    },
                })),
            };

            if (map.current.getSource('destinations')) {
                map.current.getSource('destinations').setData(destGeojson);
                return;
            }
            // Add the destinations data to be used later for clustering
            map.current.addSource('destinations', {
                type: 'geojson',
                data: destGeojson,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });

            // Add layers for clustered and unclustered points
            map.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'destinations',
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
                source: 'destinations',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-size': 12,
                },
            });

            // The actual points that are shown in the map
            map.current.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'destinations',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#f59e0b', // Orange color for unclustered points
                    'circle-radius': 8,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
            });

            // Loop through destinations (unclustered ones only)
            destinations.forEach((d) => {
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


                // Label element (destination name)
                const label = document.createElement('div');
                label.textContent = d.name;
                label.style.fontSize = '10px';
                label.style.fontWeight = 'bold';
                label.style.color = '#000';
                label.style.whiteSpace = 'nowrap';
                label.style.overflow = 'hidden';
                label.style.textOverflow = 'ellipsis';
                label.style.maxWidth = '120px'; // optional: limit width for long names

                container.appendChild(label);

                console.log(d.longitude);
                console.log(d.latitude);

                // Add the marker to the map
                const marker = new mapboxgl.Marker({
                    element: container,
                    anchor: 'bottom', // Adjust anchor to align with the bottom of the image
                    offset: [50, 35], // Adjust offset to position the marker above the image
                })
                    .setLngLat([parseFloat(d.longitude), parseFloat(d.latitude)])
                    .addTo(map.current);

                domMarkers.current.push({ marker, destination: d });

            });


            // This handles the clustered points
            map.current.on('click', 'clusters', (e) => {
                const features = map.current.queryRenderedFeatures(e.point, {
                    layers: ['clusters'],
                });
                const clusterId = features[0].properties.cluster_id;
                map.current.getSource('destinations').getClusterExpansionZoom(
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

            // This handles the unclustered points
            map.current.on('click', 'unclustered-point', (e) => {

                const coords = e.features[0].geometry.coordinates.slice();
                const props = e.features[0].properties;
                const destId = parseInt(props.id);
                const targetMarker = domMarkers.current.find(
                    ({ destination: d }) => d.id === destId
                );

                const html = `
                    <div  class="p-2">
                    <img src="/storage/${props.image}" class="rounded-lg w-full h-28 object-cover mb-2" />
                    <h3 class="text-md font-bold">${props.name}</h3>
                    <p class="text-sm text-gray-600">${props.category}</p>
                    </div>
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
            });

            // This cleares the custom overlays when clicking on the map
            map.current.on('click', (e) => {
                // Close popup only if clicking blank space
                const features = map.current.queryRenderedFeatures(e.point);
                if (features.length === 0) {
                    clearMapOverlays();
                    setActiveBuildingId(null);
                }

            });

            // This changes the cursor to pointer when hovering over clusters
            map.current.on('mouseenter', 'clusters', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });

            // This changes the cursor back to default when leaving clusters
            map.current.on('mouseleave', 'clusters', () => {
                map.current.getCanvas().style.cursor = '';
            });

            // This hides the custom markers when zoom is greater than or equal to 14
            map.current.on('zoom', () => {
                const zoom = map.current.getZoom();
                const showMarkers = zoom >= 14; // Customize threshold if needed

                domMarkers.current.forEach(({ marker }) => {
                    if (marker && typeof marker.getElement === 'function') {
                        marker.getElement().style.display = showMarkers ? 'block' : 'none';
                    }
                });
            });

            // Sets the last map view in local storage when the map is moved
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
    }, [buildings, destinations]);
    return (
        <AuthenticatedLayout>
            <Head title="Map Destination" />
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Map Destination </h1>
                <div ref={mapContainer} className="w-full h-[80vh] rounded-lg shadow-md border" />


            </div>
        </AuthenticatedLayout>
    );
}
