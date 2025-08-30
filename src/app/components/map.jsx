"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet"; // keep this as a normal import
import "leaflet/dist/leaflet.css";

// Dynamically import components to avoid SSR errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// Marker icon: create on client only to avoid SSR "window is not defined"
// We lazy-load leaflet and construct the icon after mount.
function useLeafletMarkerIcon() {
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Only run in browser
      if (typeof window === "undefined") return;
      const L = await import("leaflet");
      const created = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      if (mounted) setIcon(created);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return icon;
}

// RecenterMap component
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (map && position && typeof map.getZoom === "function") {
      map.flyTo(position, map.getZoom(), { animate: true });
      map.invalidateSize();
    }
  }, [map, position]);

  return null;
}

export default function LocationMap({ position, setPosition }) {
  const [latitude, setLatitude] = useState(position[0]);
  const [longitude, setLongitude] = useState(position[1]);
  const [cyclone, setCyclone] = useState(null);
  const markerIcon = useLeafletMarkerIcon();

  // Update position from inputs
  const handleSearch = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lon)) {
      setPosition([lat, lon]);
      localStorage.setItem("latitude", lat.toString());
      localStorage.setItem("longitude", lon.toString());
    }
  };

  // Fetch nearest cyclone when position changes
  useEffect(() => {
    if (!position) return;

    const fetchCyclone = async () => {
      try {
        const res = await fetch(
          `https://data.api.xweather.com/tropicalcyclones/closest?client_id=${process.env.API_ID}&client_secret=${process.env.API_SECRET}&lat=${position[0]}&lon=${position[1]}`
        );
        const data = await res.json();
        if (data && data.length > 0) setCyclone(data[0]);
        else {
          setCyclone(null);
          console.log("No cyclone data found for this location.");
        }
      } catch (err) {
        console.error("Error fetching cyclone data:", err);
        setCyclone(null);
      }
    };

    fetchCyclone();
  }, [position]);

  // Update input fields when position changes
  useEffect(() => {
    if (position) {
      setLatitude(position[0]);
      setLongitude(position[1]);
    }
  }, [position]);

  return (
    <div className="p-4 bg-[#0d1117] rounded-xl text-white shadow-lg">
      <h2 className="text-lg font-semibold mb-3">🌍 Your Location</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
        >
          Set
        </button>
      </div>

      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        {position ? (
          <MapContainer
            center={position}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* User marker */}
            {markerIcon && (
              <Marker position={position} icon={markerIcon}>
                <Popup>
                  📍 Latitude: {position[0].toFixed(3)}, Longitude:{" "}
                  {position[1].toFixed(3)}
                </Popup>
              </Marker>
            )}

            {/* Cyclone path */}
            {cyclone && cyclone.path && (
              <>
                <Polyline
                  positions={cyclone.path.map((p) => [p.lat, p.lon])}
                  color="red"
                  weight={3}
                  dashArray="5,10"
                />
                {markerIcon &&
                  cyclone.path.map((p, idx) => (
                    <Marker key={idx} position={[p.lat, p.lon]} icon={markerIcon}>
                      <Popup>
                        <b>{cyclone.name}</b> <br />
                        Category: {p.category} <br />
                        Wind: {p.wind_speed} km/h <br />
                        Date: {new Date(p.timestamp).toLocaleString()}
                      </Popup>
                    </Marker>
                  ))}
              </>
            )}

            <RecenterMap position={position} />
          </MapContainer>
        ) : (
          <p className="text-gray-400">Fetching location...</p>
        )}
      </div>
    </div>
  );
}