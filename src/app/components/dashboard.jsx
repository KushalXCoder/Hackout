"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, Waves, Activity } from "lucide-react";
import WindSpeedChart from "./windspeed";
import WaterTemperatureChart from "./watertemp";
import TideLevel from "./tidelevel";
import LocationMap from "./map";

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

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `11:${i < 10 ? "0" + i : i} PM`,
    tide: 1.5 + Math.sin(i * 0.2) * 0.5,
    wind: 10 + Math.cos(i * 0.15) * 15,
    temp: 20 + Math.sin(i * 0.1) * 3,
    pollution: 40 + Math.cos(i * 0.25) * 20,
  }));

  const [position, setPosition] = useState([37.7749, -122.4194]);

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
                <h3 className={`font-semibold text-lg ${
                  alert.status === "danger" ? "text-red-300" : "text-green-300"
                }`}>
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
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors">
            Sea Level Rise
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors">
            Cyclone Path
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-600 text-white text-sm hover:bg-gray-500 transition-colors">
            Fishing Zones
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors">
            Restricted Zones
          </button>
        </div>
        {/* <div className="flex-1 relative rounded-xl bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://via.placeholder.com/600x400.png?text=Map+Placeholder')] bg-cover bg-center opacity-20"></div>
          <Activity className="w-20 h-20 text-red-400 opacity-50 animate-pulse" />
          <div className="absolute bottom-4 left-4 text-sm text-gray-300">
            <h4 className="font-semibold text-white mb-2">Legend</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div> Safe Zone
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Caution Zone
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div> Danger Zone
            </div>
          </div>
        </div> */}
        <LocationMap position={position} setPosition={setPosition} />
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