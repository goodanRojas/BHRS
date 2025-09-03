import SellerLayout from "@/Layouts/SellerLayout";
import { Head } from "@inertiajs/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// React component for popup
function PopupContent({ building }) {
    return (
        <div style={{ maxWidth: "250px" }}>
            <img
                src={`/storage/${building.image}`}
                alt={building.name}
                style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "6px",
                }}
            />
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                {building.name}
            </h3>
            <p style={{ margin: "2px 0", fontSize: "14px" }}>
                {building.address.barangay}, {building.address.municipality}
                <br />
                {building.address.province}, Region {building.address.region}
            </p>
        </div>
    );
}

export default function SellerMap({ building }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markerRef = useRef(null);
    const popupRef = useRef(null);

    useEffect(() => {
        if (map.current) return; // initialize only once

        const lat = parseFloat(building.latitude);
        const lng = parseFloat(building.longitude);

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: 16,
        });
        map.current.on("load", () => {
            map.current.addSource("point", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: { type: "Point", coordinates: [lng, lat] },
                            properties: { title: building.name },
                        },
                    ],
                },
            });

            map.current.addLayer({
                id: "points",
                type: "symbol",
                source: "point",
                layout: {
                    "icon-image": "marker-15", // default Mapbox marker
                    "text-field": ["get", "title"],
                    "text-offset": [1, 0], // move text beside marker
                    "text-anchor": "left",
                },
            });
        });

        // Create a DOM container for React popup
        const popupNode = document.createElement("div");
        ReactDOM.createRoot(popupNode).render(
            <PopupContent building={building} />
        );

        // Create popup
        popupRef.current = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
            .setLngLat([lng, lat])
            .setDOMContent(popupNode);

        // Create marker
        markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(popupRef.current) // attach popup to marker
            .addTo(map.current);

        // Show popup initially
        popupRef.current.addTo(map.current);



        // Map click → close popup
        map.current.on("click", (e) => {
            if (!markerRef.current.getElement().contains(e.originalEvent.target)) {
                popupRef.current.remove();
            }
        });

        // Keep popup position synced on move
        map.current.on("moveend", () => {
            if (popupRef.current && popupRef.current.isOpen()) {
                popupRef.current.setLngLat([lng, lat]);
            }
        });
    }, [building]);

    return (
        <SellerLayout>
            <Head title={`Map - ${building.name}`} />
            <div
                ref={mapContainer}
                style={{ width: "100%", height: "100vh", borderRadius: "10px" }}
            />
        </SellerLayout>
    );
}
