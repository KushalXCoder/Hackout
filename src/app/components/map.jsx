"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function LocationMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [manualInput, setManualInput] = useState("");

  // 📍 Auto-detect location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  // 🌍 Convert user input (city name) to lat/lon using OpenStreetMap Nominatim API
  const handleSearch = async () => {
    if (!manualInput) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${manualInput}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Location fetch failed:", error);
    }
  };

  return (
    <div className="p-4 bg-[#0d1117] rounded-xl text-white shadow-lg">
      <h2 className="text-lg font-semibold mb-3">🌍 Your Location</h2>

      {/* Input box */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city or country"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Map */}
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
            <Marker position={position} icon={markerIcon}>
              <Popup>
                📍 Latitude: {position[0].toFixed(3)}, Longitude:{" "}
                {position[1].toFixed(3)}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-gray-400">Fetching location...</p>
        )}
      </div>
    </div>
  );
}