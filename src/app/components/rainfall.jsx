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

const Rainfall = ({ latitude, longitude }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation&timezone=Asia%2FSingapore&forecast_days=1`
        );
        const json = await res.json();

        if (json?.hourly?.precipitation && Array.isArray(json.hourly.time)) {
          const chartData = json.hourly.time
            .map((t, i) => {
              const v = json.hourly.precipitation[i];
              const num = typeof v === "number" ? v : Number(v);
              if (!Number.isFinite(num)) return null;
              return {
                time: new Date(t).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                precipitation: num,
              };
            })
            .filter(Boolean);

          setData(chartData);
        }
      } catch (err) {
        console.error("Error fetching rainfall data", err);
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
    <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-lg">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-gray-300">🌧 Rainfall</span>
        {(() => {
          const lastVal = data.length > 0 ? data[data.length - 1].precipitation : null;
          return (
            <span className="text-blue-400">
              {typeof lastVal === "number" && Number.isFinite(lastVal)
                ? `${lastVal.toFixed(2)} mm`
                : "--"}
            </span>
          );
        })()}
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
            dataKey="precipitation"
            stroke="url(#rainGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#3b82f6" }}
          />
          <defs>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Rainfall;