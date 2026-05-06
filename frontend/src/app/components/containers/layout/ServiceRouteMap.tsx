"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2 } from "lucide-react";

// Fix standard Leaflet icon paths
const iconRetinaUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const ServiceIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Premium Pulsating GPS Dot for Worker Location
const WorkerPulseIcon = typeof window !== "undefined"
  ? L.divIcon({
      html: `
        <div class="relative flex items-center justify-center" style="width: 24px; height: 24px;">
          <div class="absolute animate-ping inline-flex h-5 w-5 rounded-full bg-indigo-400 opacity-75"></div>
          <div class="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600 border-2 border-white shadow-md"></div>
        </div>
      `,
      className: "custom-worker-marker-pulse",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  : undefined;

interface ServiceRouteMapProps {
  serviceLat: number;
  serviceLng: number;
  workerLat?: number;
  workerLng?: number;
  height?: string;
}

// Controller component to center & scale bounds of map
const MapBoundsFit = ({
  routeCoords,
  serviceLat,
  serviceLng,
}: {
  routeCoords: [number, number][];
  serviceLat: number;
  serviceLng: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (serviceLat && serviceLng) {
      map.setView([serviceLat, serviceLng], 14);
    }
  }, [map, routeCoords, serviceLat, serviceLng]);

  return null;
};

export const ServiceRouteMap: React.FC<ServiceRouteMapProps> = ({
  serviceLat,
  serviceLng,
  workerLat,
  workerLng,
  height,
}) => {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [drivingInfo, setDrivingInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);

  const hasWorkerLoc = !!(workerLat && workerLng);

  useEffect(() => {
    if (workerLat && workerLng && serviceLat && serviceLng) {
      const fetchRoadRoute = async () => {
        try {
          setFetchingRoute(true);
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${workerLng},${workerLat};${serviceLng},${serviceLat}?overview=full&geometries=geojson`
          );
          if (!res.ok) throw new Error("OSRM request failed");
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            setRouteCoords(coords);
            
            const distanceKm = data.routes[0].distance / 1000;
            const durationMin = data.routes[0].duration / 60;
            setDrivingInfo({ distanceKm, durationMin });
          } else {
            // Straight line fallback
            setRouteCoords([[workerLat, workerLng], [serviceLat, serviceLng]]);
          }
        } catch (err) {
          console.error("OSRM Routing error, falling back to straight line:", err);
          // Straight line fallback
          setRouteCoords([[workerLat, workerLng], [serviceLat, serviceLng]]);
        } finally {
          setFetchingRoute(false);
        }
      };
      fetchRoadRoute();
    } else {
      setRouteCoords([]);
      setDrivingInfo(null);
    }
  }, [workerLat, workerLng, serviceLat, serviceLng]);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative isolate z-0"
      style={{ height: height || "280px" }}
    >
      <MapContainer
        center={[serviceLat, serviceLng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Service Pin */}
        <Marker position={[serviceLat, serviceLng]} icon={ServiceIcon}>
          <Popup>
            <div className="text-xs font-bold text-gray-800">Service Destination</div>
          </Popup>
        </Marker>

        {/* Worker Pulse Pin */}
        {hasWorkerLoc && WorkerPulseIcon && (
          <Marker position={[workerLat, workerLng]} icon={WorkerPulseIcon}>
            <Popup>
              <div className="text-xs font-bold text-indigo-700">Your Location</div>
            </Popup>
          </Marker>
        )}

        {/* Driving Route Polyline along the actual roads */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: "#4f46e5",
              weight: 5,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* Auto fit layout bounds */}
        <MapBoundsFit
          routeCoords={routeCoords.length > 0 ? routeCoords : (hasWorkerLoc ? [[workerLat!, workerLng!], [serviceLat, serviceLng]] : [])}
          serviceLat={serviceLat}
          serviceLng={serviceLng}
        />
      </MapContainer>

      {/* Floating Driving Route HUD */}
      {drivingInfo && (
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-md z-[400] max-w-[190px] text-xs font-semibold text-slate-700 animate-in slide-in-from-top-2 duration-300">
          <p className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
            {fetchingRoute && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            🚘 Road Route
          </p>
          <div className="space-y-0.5">
            <p className="text-sm font-black text-slate-900 leading-none">
              {drivingInfo.distanceKm.toFixed(1)} km
            </p>
            <p className="text-slate-500 font-medium text-[10px]">
              Est: {Math.round(drivingInfo.durationMin)} mins drive
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
