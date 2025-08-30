"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Waves, Activity } from "lucide-react";
import WindSpeedChart from "./windspeed";
import WaterTemperatureChart from "./watertemp";
import TideLevel from "./tidelevel";
import LocationMap from "./map";
import CombinedData from "./getData";
import Rainfall from "./rainfall";

export default function CoastalDashboard() {
  const [position, setPosition] = useState([37.7749, -122.4194]);
  const [activeMap, setActiveMap] = useState("default");
  const [inputData, setInputData] = useState(null); // 🌊 live sensor data
  const [predictions, setPredictions] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock response for fallback
  const mockResponse = {
    algae: 3.8455799999999987,
    bleaching: { prediction: 1, probability: 0.993824565319233 },
    hurricane: 0.19,
    tsunami: 0.65,
  };

  // 🔗 Call /api/predict and Gemini whenever inputData updates
  useEffect(() => {
    if (!inputData) return;

    const fetchPredictions = async () => {
      setLoading(true);
      try {
        let data = null;
        console.log(inputData);

        const res = await fetch("http://127.0.0.1:5000/predict_all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inputData),
        });

        if (res.ok) {
          data = await res.json();
          const isEmpty =
            !data || (typeof data === "object" && Object.keys(data).length === 0);
          if (isEmpty) {
            console.warn("Prediction API returned empty. Using mock response.");
            data = mockResponse;
          }
        } else {
          console.warn("Prediction API failed. Using mock response.");
          data = mockResponse;
        }

        setPredictions(data);

        // Gemini API
        const geminiRes = await fetch("/api/gemini-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictions: data }),
        });

        if (!geminiRes.ok) throw new Error("Gemini API failed");
        const geminiData = await geminiRes.json();
        setAlerts(geminiData.alerts || []);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setPredictions(mockResponse);
        try {
          const geminiRes = await fetch("/api/gemini-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ predictions: mockResponse }),
          });
          const geminiData = await geminiRes.json();
          setAlerts(geminiData.alerts || []);
        } catch (geminiErr) {
          console.error("Gemini fallback failed:", geminiErr);
          setAlerts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [inputData]);

  // Helper to show warning if data is missing
  const showValue = (value, label) =>
    value != null ? value : `${label} unavailable: chosen coordinate might be on land`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 font-roboto antialiased flex gap-6 p-6">
      {/* 🌊 CombinedData fetcher */}
      <CombinedData
        latitude={position[0]}
        longitude={position[1]}
        onData={setInputData}
      />

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
                  <h3
                    className={`font-semibold text-lg ${
                      alert.status === "danger"
                        ? "text-red-300"
                        : "text-green-300"
                    }`}
                  >
                    {alert.type}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      alert.status === "danger"
                        ? "bg-red-700 text-red-100"
                        : "bg-green-700 text-green-100"
                    }`}
                  >
                    {alert.status === "danger" ? "Danger" : "Safe"}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{alert.location}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {alert.description}
                </p>
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
                activeMap === mapType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-white hover:bg-gray-500"
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
              src={`https://embed.windy.com/embed.html?type=map&zoom=4&lat=${position[0]}&lon=${position[1]}&overlay=waves&product=ecmwfWaves&level=surface`}
              frameBorder="0"
            ></iframe>
          ) : activeMap === "wind" ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://embed.windy.com/embed.html?type=map&zoom=4&lat=${position[0]}&lon=${position[1]}&overlay=gustAccu&product=ecmwf&level=surface&marker=true`}
              frameBorder="0"
            ></iframe>
          ) : activeMap === "tides" ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://embed.windy.com/embed.html?type=map&zoom=4&lat=${position[0]}&lon=${position[1]}&overlay=currentsTide&product=cmems&level=surface`}
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
          <Activity className="w-6 h-6" /> Sensor Data & Predictions
        </h2>

        {/* Predictions */}
        <div className="space-y-4 mb-6">
          <div>
            <strong>Algae Index:</strong> {showValue(predictions?.algae, "Algae Index")}
          </div>
          <div>
            <strong>Bleaching Prediction:</strong>{" "}
            {predictions?.bleaching?.prediction != null
              ? `${predictions.bleaching.prediction} (prob: ${(
                  predictions.bleaching.probability * 100
                ).toFixed(1)}%)`
              : "Bleaching data unavailable: chosen coordinate might be on land"}
          </div>
          <div>
            <strong>Hurricane Risk:</strong> {showValue(predictions?.hurricane, "Hurricane Risk")}
          </div>
          <div>
            <strong>Tsunami Risk:</strong> {showValue(predictions?.tsunami, "Tsunami Risk")}
          </div>
        </div>

        {/* Sensor charts */}
        <div className="space-y-8 ">
          <TideLevel latitude={position[0]} longitude={position[1]} />
          <WindSpeedChart latitude={position[0]} longitude={position[1]} />
          <WaterTemperatureChart latitude={position[0]} longitude={position[1]} />
          {/* <Rainfall latitude={position[0]} longitude={position[1]} /> */}
        </div>
      </div>
    </div>
  );
}
