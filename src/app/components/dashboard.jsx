"use client";

import { useState } from "react";
import { AlertTriangle, Waves, Activity } from "lucide-react";
import WindSpeedChart from "./windspeed";
import WaterTemperatureChart from "./watertemp";
import TideLevel from "./tidelevel";
import LocationMap from "./map";
import CombinedData from "./getData";

export default function CoastalDashboard() {
  const alerts = [
    {
      type: "Storm Surge Alert",
      location: "Harbor District",
      description: "Abnormal tide patterns observed. Coastal areas may experience elevated water levels.",
      time: "11:51:20 PM",
      status: "danger",
    },
    {
      type: "Vessel in Distress",
      location: "Coastal Zone Beta",
      description: "Maritime traffic monitoring reports vessel requiring assistance or posing navigation risk.",
      time: "11:51:14 PM",
      status: "danger",
    },
    {
      type: "Water Quality Alert",
      location: "Bay Area Alpha",
      description: "Environmental sensors detect contamination levels above safe thresholds.",
      time: "11:51:05 PM",
      status: "safe",
    },
    {
      type: "Coastal Flooding Risk",
      location: "Coastal Zone Beta",
      description: "Abnormal tide patterns observed. Coastal areas may experience elevated water levels.",
      time: "11:49:27 PM",
      status: "danger",
    },
  ];

  const [position, setPosition] = useState([37.7749, -122.4194]);
  const [activeMap, setActiveMap] = useState("default"); // "default" or "waves"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 font-roboto antialiased flex gap-6 p-6">
      {/* Alert Feed */}
      <div className="w-1/4 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg flex flex-col h-[calc(100vh-3rem)]">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-5 text-teal-400">
          <AlertTriangle className="w-6 h-6" /> Real-time Alert Feed
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {alerts.map((alert, idx) => (
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
                    alert.status === "danger" ? "text-red-300" : "text-green-300"
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
              <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
            </div>
          ))}
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
<div className="flex gap-3 mb-6 flex-wrap">
  <button
    onClick={() => setActiveMap("default")}
    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
      activeMap === "default"
        ? "bg-blue-600 text-white"
        : "bg-gray-600 text-white hover:bg-gray-500"
    }`}
  >
    Default Map
  </button>
  <button
    onClick={() => setActiveMap("waves")}
    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
      activeMap === "waves"
        ? "bg-blue-600 text-white"
        : "bg-gray-600 text-white hover:bg-gray-500"
    }`}
  >
    Waves
  </button>
  <button
    onClick={() => setActiveMap("wind")}
    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
      activeMap === "wind"
        ? "bg-blue-600 text-white"
        : "bg-gray-600 text-white hover:bg-gray-500"
    }`}
  >
    Wind
  </button>
  <button
    onClick={() => setActiveMap("tides")}
    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
      activeMap === "tides"
        ? "bg-blue-600 text-white"
        : "bg-gray-600 text-white hover:bg-gray-500"
    }`}
  >
    Tides
  </button>
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



        <CombinedData latitude={19.0760} longitude={72.8777} /> 
      </div>

      {/* Sensor Data */}
      <div className="w-1/4 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg flex flex-col h-[calc(100vh-3rem)]">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-teal-400">
          <Activity className="w-6 h-6" /> Sensor Data & Trends
        </h2>
        <div className="space-y-8">
          <div>
            <TideLevel latitude={position[0]} longitude={position[1]} />
          </div>

          <div>
            <WindSpeedChart latitude={position[0]} longitude={position[1]} />
          </div>

          <div>
            <WaterTemperatureChart latitude={position[0]} longitude={position[1]} />
          </div>

        </div>
      </div>
    </div>
  );
}
