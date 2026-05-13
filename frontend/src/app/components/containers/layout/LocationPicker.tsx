"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js/Webpack
const iconRetinaUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
    /** Pass a new value here to imperatively fly the map to a GPS position */
    flyToLat?: number;
    flyToLng?: number;
}

/* ── Click-to-pin + show marker ── */
const LocationMarker = ({
    onLocationSelect,
    initialPosition,
}: {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPosition: L.LatLng | null;
}) => {
    const [position, setPosition] = useState<L.LatLng | null>(initialPosition);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    // Sync marker when initialPosition changes (GPS fly-to from parent)
    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    return position === null ? null : <Marker position={position} />;
};

/* ── Fly to a position when it changes (GPS button) ── */
const MapFlyTo = ({ position }: { position: L.LatLng | null }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 1.2 });
        }
    }, [map, position]);
    return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
    onLocationSelect,
    initialLat = 51.505,
    initialLng = -0.09,
    flyToLat,
    flyToLng,
}) => {
    const hasInitialValid = initialLat !== 0 || initialLng !== 0;
    const centerLat = hasInitialValid ? initialLat : 51.505;
    const centerLng = hasInitialValid ? initialLng : -0.09;
    const initialPosition = hasInitialValid ? new L.LatLng(centerLat, centerLng) : null;

    // Derive fly-to position from props; undefined means no GPS pin yet
    const flyToPosition =
        flyToLat !== undefined && flyToLng !== undefined
            ? new L.LatLng(flyToLat, flyToLng)
            : null;

    // The marker should show at flyToPosition if available, else initialPosition
    const markerPosition = flyToPosition ?? initialPosition;

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm isolate" style={{ zIndex: 0, position: 'relative' }}>
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} initialPosition={markerPosition} />
                {/* Fly to GPS position when it changes */}
                <MapFlyTo position={flyToPosition} />
            </MapContainer>
        </div>
    );
};
