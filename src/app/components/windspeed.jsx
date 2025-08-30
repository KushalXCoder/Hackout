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

const WindSpeedChart = ({ latitude, longitude }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Open-Meteo API (wind speed at 80m height, minutely data)
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=wind_speed_80m&models=best_match&minutely_15=wind_speed_80m&timezone=Asia%2FSingapore&forecast_days=1`
        );
        const data = await res.json();

        // Transform API data → chart-friendly format
        const formatted = Array.isArray(data?.minutely_15?.time)
          ? data.minutely_15.time
              .map((time, i) => {
                const v = data.minutely_15.wind_speed_80m?.[i];
                const num = typeof v === "number" ? v : Number(v);
                if (!Number.isFinite(num)) return null;
                return {
                  time: new Date(time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  wind: num,
                };
              })
              .filter(Boolean)
          : [];

        setChartData(formatted);
      } catch (err) {
        console.error("Failed to fetch wind speed:", err);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-gray-300">Wind Speed</span>
        {(() => {
          const lastVal = chartData.length > 0 ? chartData[chartData.length - 1].wind : null;
          return (
            <span className="text-green-400">
              {typeof lastVal === "number" && Number.isFinite(lastVal) ? `${lastVal.toFixed(1)} km/h` : "--"}
            </span>
          );
        })()}
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
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
            dataKey="wind"
            stroke="url(#windGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#facc15" }}
          />
          <defs>
            <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity={1} />
              <stop offset="100%" stopColor="#fde047" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindSpeedChart;