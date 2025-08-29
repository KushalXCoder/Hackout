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

  const latitude = 37.7749;
  const longitude = -122.4194;

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
        <div className="flex-1 relative rounded-xl bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center overflow-hidden">
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
        </div>
      </div>

      {/* Sensor Data */}
      <div className="w-1/4 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg flex flex-col h-[calc(100vh-3rem)]">
        <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-teal-400">
          <Activity className="w-6 h-6" /> Sensor Data & Trends
        </h2>
        <div className="space-y-8">
          <div>
            {/* <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-300">Tide Levels (24h)</span>
              <span className="text-green-400">1.6 m</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#9ca3af" interval="preserveStartEnd" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }} />
                <Line
                  type="monotone"
                  dataKey="tide"
                  stroke="url(#tideGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#3b82f6" }}
                />
                <defs>
                  <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer> */}
            <TideLevel latitude={latitude} longitude={longitude} />
          </div>

          <div>
            <WindSpeedChart latitude={latitude} longitude={longitude} />
          </div>

          <div>
            <WaterTemperatureChart latitude={latitude} longitude={longitude} />
          </div>

          {/* <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-300">Pollution Index</span>
              <span className="text-green-400">49.8 AQI</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#9ca3af" interval="preserveStartEnd" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }} />
                <Line
                  type="monotone"
                  dataKey="pollution"
                  stroke="url(#pollutionGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#ef4444" }}
                />
                <defs>
                  <linearGradient id="pollutionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f87171" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div> */}
        </div>
      </div>
    </div>
  );
}