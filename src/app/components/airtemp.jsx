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

const AirTemperature = ({ latitude, longitude }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=Asia%2FSingapore&forecast_days=1`
        );
        const json = await res.json();
        if (json?.hourly?.temperature_2m && Array.isArray(json.hourly.time)) {
          const chartData = json.hourly.time
            .map((t, i) => ({
              time: new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              temperature: json.hourly.temperature_2m[i],
            }))
            .filter((d) => Number.isFinite(d.temperature));
          setData(chartData);
        }
      } catch (err) {
        console.error("Error fetching air temperature data", err);
      }
    };

    const lat = latitude || parseFloat(localStorage.getItem("latitude"));
    const lon = longitude || parseFloat(localStorage.getItem("longitude"));
    if (lat && lon) fetchData(lat, lon);
  }, [latitude, longitude]);

  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-gray-300">🌡 Air Temperature</span>
        {(() => {
          const lastVal = data.length > 0 ? data[data.length - 1].temperature : null;
          return (
            <span className="text-red-400">
              {typeof lastVal === "number" ? `${lastVal.toFixed(1)} °C` : "--"}
            </span>
          );
        })()}
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }} />
          <Line type="monotone" dataKey="temperature" stroke="url(#tempGradient)" strokeWidth={2} dot={false} />
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
              <stop offset="100%" stopColor="#fecaca" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AirTemperature;