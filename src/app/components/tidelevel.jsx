"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TideLevel = ({ latitude, longitude }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
  const fetchData = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=sea_level_height_msl&timezone=Asia%2FSingapore&forecast_days=1`
      );
      const json = await res.json();
      if (json?.hourly?.sea_level_height_msl) {
        const chartData = json.hourly.time.map((t, i) => ({
          time: new Date(t).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sea_level_height_msl: json.hourly.sea_level_height_msl[i],
        }));
        setData(chartData);
      }
    } catch (err) {
      console.error("Error fetching tide level data", err);
    }
  };

  // Initial fetch from props or localStorage fallback
  const lat = latitude || parseFloat(localStorage.getItem("latitude"));
  const lon = longitude || parseFloat(localStorage.getItem("longitude"));
  if (lat && lon) fetchData(lat, lon);

  // Listen to localStorage changes
  const handleStorage = (e) => {
    if (e.key === "latitude" || e.key === "longitude") {
      const newLat = parseFloat(localStorage.getItem("latitude"));
      const newLon = parseFloat(localStorage.getItem("longitude"));
      if (!isNaN(newLat) && !isNaN(newLon)) fetchData(newLat, newLon);
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
  }, [latitude, longitude]);


  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-gray-300">🌊 Tide Levels</span>
        {data.length > 0 && (
          <span className="text-green-400">
            {data[data.length - 1].sea_level_height_msl.toFixed(2)} m
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            interval="preserveStartEnd"
            tick={{ fontSize: 10 }}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }}
          />
          <Line
            type="monotone"
            dataKey="sea_level_height_msl"
            stroke="url(#tideGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#22d3ee" }}
          />
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TideLevel;