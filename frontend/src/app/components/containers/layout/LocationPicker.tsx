"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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
}

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

    // Update internal state if initialPosition changes (e.g. from parent GPS fetch)
    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    return position === null ? null : <Marker position={position} />;
};

// Component to recenter map when props change
const MapRecenter = ({ position }: { position: L.LatLng | null }) => {
    const map = useMapEvents({});
    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);
    return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
    onLocationSelect,
    initialLat = 51.505, // Default to London or somewhere generic if 0
    initialLng = -0.09,
}) => {
    // Use a default center if initialLat/Lng are 0 (which might be passed from empty state)
    // If they are explicitly provided and non-zero (or valid 0 like prime meridian), use them.
    // But usually 0,0 is "null island".
    const hasInitialValid = initialLat !== 0 || initialLng !== 0;

    const centerLat = hasInitialValid ? initialLat : 51.505;
    const centerLng = hasInitialValid ? initialLng : -0.09;

    const initialPosition = hasInitialValid ? new L.LatLng(centerLat, centerLng) : null;

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm z-0">
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
                <LocationMarker onLocationSelect={onLocationSelect} initialPosition={initialPosition} />
                {initialPosition && <MapRecenter position={initialPosition} />}
            </MapContainer>
        </div>
    );
};
