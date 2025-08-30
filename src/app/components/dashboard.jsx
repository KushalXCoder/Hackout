"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Waves, Activity } from "lucide-react";
import WindSpeedChart from "./windspeed";
import WaterTemperatureChart from "./watertemp";
import TideLevel from "./tidelevel";
import LocationMap from "./map";

export default function CoastalDashboard() {
  const [position, setPosition] = useState([37.7749, -122.4194]);
  const [activeMap, setActiveMap] = useState("default");
  const [predictions, setPredictions] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const predictionInput = {
    hurricane: {
      wind_speed: 120,
      pressure: 950,
      latitude: 18.5,
      longitude: -75.3,
      storm_category: 4,
      humidity: 80,
      wind_direction: 270,
      wave_height: 12,
      month: 9,
      day_of_year: 250,
      sea_surface_temp: 29.0,
      cloud_cover: 75,
      precipitation: 200,
      storm_radius: 50
    },
    tsunami: {
      magnitude: 7.2,
      cdi: 6,
      mmi: 5,
      sig: 900,
      nst: 50,
      dmin: 0.02,
      gap: 120,
      depth: 30,
      latitude: -15.2,
      longitude: 167.5,
      year: 2025,
      month: 8,
      mag_type: "mw"
    },
    algae: {
      significant_wave_height: 1.2,
      max_wave_height: 2.5,
      mean_wave_period: 6.5,
      peak_wave_period: 8.2,
      sea_surface_temp: 27.5,
      chlorophyll_concentration: 3.2,
      salinity: 34.8,
      nutrient_level: 2.1,
      oxygen_concentration: 6.7
    },
    bleaching: {
      date: "2025-08-30",
      location_name: "Great Barrier Reef",
      latitude: -18.2871,
      longitude: 147.6992,
      sea_surface_temp: 29.1,
      ph_level: 8.05,
      bleaching_severity: "Medium",
      species_observed: 34,
      marine_heatwave: true,
      chlorophyll: 0.6,
      salinity: 35.1,
      turbidity: 0.7,
      oxygen_level: 6.8,
      nutrient_index: 0.9,
      wave_height: 1.2,
      current_speed: 0.4
    }
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        // Fetch predictions from backend
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(predictionInput)
        });
        const data = await res.json();
        setPredictions(data);

        // Fetch Gemini API generated alerts
        const geminiRes = await fetch("/api/gemini-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictions: data })
        });
        const geminiData = await geminiRes.json();
        // Expected: geminiData.alerts = [{ type, location, description, status }]
        setAlerts(geminiData.alerts);
      } catch (err) {
        console.error("Error fetching predictions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 font-roboto antialiased flex gap-6 p-6">

      {/* Alert Feed */}
      <div className="w-1/4 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg flex flex-col h-[calc(100vh-3rem)]">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-5 text-teal-400">
          <AlertTriangle className="w-6 h-6" /> Real-time Alert Feed
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {loading ? (
            <p className="text-gray-300">Loading predictions...</p>
          ) : alerts.length > 0 ? (
            alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-4 border-l-4 ${
                  alert.status === "danger"
                    ? "bg-red-900/40 border-red-500"
                    : "bg-green-900/40 border-green-500"
                } transition-all duration-200 hover:bg-opacity-60`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold text-lg ${alert.status === "danger" ? "text-red-300" : "text-green-300"}`}>
                    {alert.type}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    alert.status === "danger"
                      ? "bg-red-700 text-red-100"
                      : "bg-green-700 text-green-100"
                  }`}>
                    {alert.status === "danger" ? "Danger" : "Safe"}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{alert.location}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{alert.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No alerts available.</p>
          )}
        </div>
      </div>

      {/* Monitoring Map */}
      <div className="w-2/4 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg flex flex-col h-[calc(100vh-3rem)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-3 text-teal-400">
            <Waves className="w-6 h-6" /> Coastal Monitoring Map
          </h2>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Live View
          </button>
        </div>

        {/* Map buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["default", "waves", "wind", "tides"].map((mapType) => (
            <button
              key={mapType}
              onClick={() => setActiveMap(mapType)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeMap === mapType ? "bg-blue-600 text-white" : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
            >
              {mapType.charAt(0).toUpperCase() + mapType.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 relative rounded-xl overflow-hidden">
          {activeMap === "waves" ? (
            <iframe
              width="100%"
              height="100%"
              src="https://embed.windy.com/embed.html?type=map&zoom=4&lat=19.401&lon=80.28&overlay=waves&product=ecmwfWaves&level=surface"
              frameBorder="0"
            ></iframe>
          ) : activeMap === "wind" ? (
            <iframe
              width="100%"
              height="100%"
              src="https://embed.windy.com/embed.html?type=map&zoom=5&lat=22.881&lon=86.107&overlay=gustAccu&product=ecmwf&level=surface&detailLat=22.880919901675366&detailLon=86.10689163208008&marker=true"
              frameBorder="0"
            ></iframe>
          ) : activeMap === "tides" ? (
            <iframe
              width="100%"
              height="100%"
              src="https://embed.windy.com/embed.html?type=map&zoom=4&lat=18.258&lon=77.634&overlay=currentsTide&product=cmems&level=surface"
              frameBorder="0"
            ></iframe>
          ) : (
            <LocationMap position={position} setPosition={setPosition} />
          )}
        </div>
      </div>

      {/* Sensor Data */}
      <div className="w-1/4 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg flex flex-col h-[calc(100vh-3rem)]">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-teal-400">
          <Activity className="w-6 h-6" /> Sensor Data & Trends
        </h2>
        <div className="space-y-8">
          <TideLevel latitude={position[0]} longitude={position[1]} />
          <WindSpeedChart latitude={position[0]} longitude={position[1]} />
          <WaterTemperatureChart latitude={position[0]} longitude={position[1]} />
        </div>
      </div>
    </div>
  );
}
