"use client";

import { useEffect, useState } from "react";

export default function CombinedData({ latitude, longitude, onData }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 5);

        const endDateStr = endDate.toISOString().split("T")[0];
        const startDateStr = startDate.toISOString().split("T")[0];

        const urls = {
          hurricane1: `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=wind_speed_10m,relative_humidity_2m,wind_direction_10m&timezone=Asia%2FBangkok`,
          hurricane2: `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&current=wave_height,sea_surface_temperature&timezone=Asia%2FSingapore&forecast_days=1`,
          hurricane3: `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=precipitation,cloud_cover&timezone=Asia%2FSingapore&forecast_days=1`,
          algae: `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&current=wave_height,wave_period,sea_surface_temperature&timezone=Asia%2FBangkok`,
          tsunami: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDateStr}&endtime=${endDateStr}&minmagnitude=7`
        };

        const responses = await Promise.all(Object.values(urls).map(u => fetch(u)));
        const results = await Promise.all(responses.map(r => r.json()));
        const [h1, h2, h3, algaeData, tsunamiData] = results;

        // ⬇️ Example dataset of algae samples
        const algaeSamples = [
            {"timestamp":"2025-01-01T00:00:00","significant_wave_height":1.26,"max_wave_height":2.15,"mean_wave_period":6.73,"peak_wave_period":7.52,"sea_surface_temp":24.31,"chlorophyll_concentration":3.50,"salinity":35.18,"nutrient_level":1.99,"oxygen_concentration":7.33},
            {"timestamp":"2025-01-01T01:00:00","significant_wave_height":1.18,"max_wave_height":2.39,"mean_wave_period":6.86,"peak_wave_period":7.74,"sea_surface_temp":26.30,"chlorophyll_concentration":3.81,"salinity":34.34,"nutrient_level":2.32,"oxygen_concentration":6.35},
            {"timestamp":"2025-01-01T02:00:00","significant_wave_height":1.28,"max_wave_height":2.41,"mean_wave_period":7.20,"peak_wave_period":8.81,"sea_surface_temp":27.51,"chlorophyll_concentration":2.75,"salinity":35.23,"nutrient_level":1.95,"oxygen_concentration":6.76},
            {"timestamp":"2025-01-01T03:00:00","significant_wave_height":1.38,"max_wave_height":2.30,"mean_wave_period":7.18,"peak_wave_period":8.70,"sea_surface_temp":27.59,"chlorophyll_concentration":3.38,"salinity":35.48,"nutrient_level":1.80,"oxygen_concentration":6.39},
            {"timestamp":"2025-01-01T04:00:00","significant_wave_height":1.17,"max_wave_height":2.46,"mean_wave_period":5.60,"peak_wave_period":8.18,"sea_surface_temp":26.60,"chlorophyll_concentration":2.99,"salinity":35.01,"nutrient_level":1.77,"oxygen_concentration":6.41},
            {"timestamp":"2025-01-01T05:00:00","significant_wave_height":1.17,"max_wave_height":2.60,"mean_wave_period":5.89,"peak_wave_period":8.30,"sea_surface_temp":28.75,"chlorophyll_concentration":3.04,"salinity":35.74,"nutrient_level":2.23,"oxygen_concentration":6.49},
            {"timestamp":"2025-01-01T06:00:00","significant_wave_height":1.39,"max_wave_height":2.97,"mean_wave_period":6.83,"peak_wave_period":9.25,"sea_surface_temp":25.36,"chlorophyll_concentration":3.01,"salinity":34.41,"nutrient_level":1.83,"oxygen_concentration":6.85},
            {"timestamp":"2025-01-01T07:00:00","significant_wave_height":1.29,"max_wave_height":2.54,"mean_wave_period":6.83,"peak_wave_period":7.71,"sea_surface_temp":27.22,"chlorophyll_concentration":2.92,"salinity":34.18,"nutrient_level":2.47,"oxygen_concentration":6.38},
            {"timestamp":"2025-01-01T08:00:00","significant_wave_height":1.14,"max_wave_height":2.56,"mean_wave_period":6.83,"peak_wave_period":8.65,"sea_surface_temp":27.74,"chlorophyll_concentration":3.22,"salinity":33.91,"nutrient_level":1.66,"oxygen_concentration":7.54},
            {"timestamp":"2025-01-01T09:00:00","significant_wave_height":1.27,"max_wave_height":2.48,"mean_wave_period":9.00,"peak_wave_period":8.03,"sea_surface_temp":28.53,"chlorophyll_concentration":2.93,"salinity":35.55,"nutrient_level":2.46,"oxygen_concentration":6.10},
            {"timestamp":"2025-01-01T10:00:00","significant_wave_height":1.32,"max_wave_height":2.38,"mean_wave_period":6.66,"peak_wave_period":7.65,"sea_surface_temp":27.12,"chlorophyll_concentration":3.09,"salinity":34.61,"nutrient_level":2.19,"oxygen_concentration":6.94},
            {"timestamp":"2025-01-01T11:00:00","significant_wave_height":1.05,"max_wave_height":2.22,"mean_wave_period":6.50,"peak_wave_period":8.12,"sea_surface_temp":26.86,"chlorophyll_concentration":3.13,"salinity":34.81,"nutrient_level":1.88,"oxygen_concentration":6.71},
            {"timestamp":"2025-01-01T12:00:00","significant_wave_height":1.22,"max_wave_height":2.57,"mean_wave_period":6.87,"peak_wave_period":8.32,"sea_surface_temp":27.36,"chlorophyll_concentration":3.10,"salinity":35.56,"nutrient_level":1.95,"oxygen_concentration":6.65},
            {"timestamp":"2025-01-01T13:00:00","significant_wave_height":1.32,"max_wave_height":2.82,"mean_wave_period":6.03,"peak_wave_period":8.52,"sea_surface_temp":28.19,"chlorophyll_concentration":2.78,"salinity":34.59,"nutrient_level":2.11,"oxygen_concentration":7.14},
            {"timestamp":"2025-01-01T14:00:00","significant_wave_height":1.25,"max_wave_height":2.57,"mean_wave_period":6.74,"peak_wave_period":8.60,"sea_surface_temp":28.06,"chlorophyll_concentration":2.90,"salinity":34.92,"nutrient_level":2.35,"oxygen_concentration":6.62},
            {"timestamp":"2025-01-01T15:00:00","significant_wave_height":1.12,"max_wave_height":2.32,"mean_wave_period":6.38,"peak_wave_period":8.39,"sea_surface_temp":27.71,"chlorophyll_concentration":3.15,"salinity":34.99,"nutrient_level":2.06,"oxygen_concentration":6.50},
            {"timestamp":"2025-01-01T16:00:00","significant_wave_height":1.36,"max_wave_height":2.59,"mean_wave_period":7.18,"peak_wave_period":8.44,"sea_surface_temp":26.95,"chlorophyll_concentration":3.45,"salinity":35.07,"nutrient_level":2.12,"oxygen_concentration":6.89},
            {"timestamp":"2025-01-01T17:00:00","significant_wave_height":1.19,"max_wave_height":2.53,"mean_wave_period":6.74,"peak_wave_period":8.31,"sea_surface_temp":27.29,"chlorophyll_concentration":3.25,"salinity":35.36,"nutrient_level":2.06,"oxygen_concentration":6.78},
            {"timestamp":"2025-01-01T18:00:00","significant_wave_height":1.32,"max_wave_height":2.73,"mean_wave_period":7.01,"peak_wave_period":8.21,"sea_surface_temp":28.44,"chlorophyll_concentration":2.85,"salinity":35.43,"nutrient_level":2.16,"oxygen_concentration":6.76},
            {"timestamp":"2025-01-01T19:00:00","significant_wave_height":1.24,"max_wave_height":2.46,"mean_wave_period":7.08,"peak_wave_period":8.11,"sea_surface_temp":27.84,"chlorophyll_concentration":3.34,"salinity":35.00,"nutrient_level":2.38,"oxygen_concentration":6.53},
            {"timestamp":"2025-01-01T20:00:00","significant_wave_height":1.17,"max_wave_height":2.24,"mean_wave_period":6.28,"peak_wave_period":8.43,"sea_surface_temp":27.62,"chlorophyll_concentration":2.80,"salinity":34.99,"nutrient_level":2.03,"oxygen_concentration":6.79},
            {"timestamp":"2025-01-01T21:00:00","significant_wave_height":1.20,"max_wave_height":2.44,"mean_wave_period":6.93,"peak_wave_period":8.34,"sea_surface_temp":27.93,"chlorophyll_concentration":3.22,"salinity":35.20,"nutrient_level":2.09,"oxygen_concentration":6.82},
            {"timestamp":"2025-01-01T22:00:00","significant_wave_height":1.35,"max_wave_height":2.67,"mean_wave_period":6.76,"peak_wave_period":8.57,"sea_surface_temp":28.32,"chlorophyll_concentration":3.04,"salinity":35.26,"nutrient_level":2.25,"oxygen_concentration":6.99},
            {"timestamp":"2025-01-01T23:00:00","significant_wave_height":1.26,"max_wave_height":2.31,"mean_wave_period":7.09,"peak_wave_period":8.08,"sea_surface_temp":28.55,"chlorophyll_concentration":2.92,"salinity":35.29,"nutrient_level":2.13,"oxygen_concentration":7.01},
            {"timestamp":"2025-01-02T00:00:00","significant_wave_height":1.28,"max_wave_height":2.49,"mean_wave_period":7.12,"peak_wave_period":8.53,"sea_surface_temp":27.99,"chlorophyll_concentration":3.19,"salinity":35.39,"nutrient_level":2.42,"oxygen_concentration":6.73},
            {"timestamp":"2025-01-02T01:00:00","significant_wave_height":1.21,"max_wave_height":2.48,"mean_wave_period":6.67,"peak_wave_period":8.41,"sea_surface_temp":27.43,"chlorophyll_concentration":2.98,"salinity":35.32,"nutrient_level":2.14,"oxygen_concentration":6.80},
            {"timestamp":"2025-01-02T02:00:00","significant_wave_height":1.15,"max_wave_height":2.32,"mean_wave_period":6.74,"peak_wave_period":8.22,"sea_surface_temp":28.11,"chlorophyll_concentration":3.31,"salinity":34.72,"nutrient_level":2.17,"oxygen_concentration":6.56},
            {"timestamp":"2025-01-02T03:00:00","significant_wave_height":1.34,"max_wave_height":2.55,"mean_wave_period":7.32,"peak_wave_period":8.66,"sea_surface_temp":27.78,"chlorophyll_concentration":3.05,"salinity":35.17,"nutrient_level":2.05,"oxygen_concentration":6.68},
            {"timestamp":"2025-01-02T04:00:00","significant_wave_height":1.29,"max_wave_height":2.41,"mean_wave_period":7.28,"peak_wave_period":8.32,"sea_surface_temp":28.16,"chlorophyll_concentration":2.94,"salinity":34.89,"nutrient_level":2.00,"oxygen_concentration":6.63},
            {"timestamp":"2025-01-02T05:00:00","significant_wave_height":1.10,"max_wave_height":2.30,"mean_wave_period":6.39,"peak_wave_period":8.22,"sea_surface_temp":28.58,"chlorophyll_concentration":3.24,"salinity":34.53,"nutrient_level":2.21,"oxygen_concentration":6.92},
            {"timestamp":"2025-01-02T06:00:00","significant_wave_height":1.31,"max_wave_height":2.61,"mean_wave_period":7.08,"peak_wave_period":8.74,"sea_surface_temp":28.45,"chlorophyll_concentration":3.08,"salinity":34.95,"nutrient_level":2.20,"oxygen_concentration":7.01},
            {"timestamp":"2025-01-02T07:00:00","significant_wave_height":1.21,"max_wave_height":2.47,"mean_wave_period":6.85,"peak_wave_period":8.33,"sea_surface_temp":27.97,"chlorophyll_concentration":2.99,"salinity":35.02,"nutrient_level":2.24,"oxygen_concentration":6.53},
            {"timestamp":"2025-01-02T08:00:00","significant_wave_height":1.11,"max_wave_height":2.46,"mean_wave_period":6.89,"peak_wave_period":8.76,"sea_surface_temp":27.73,"chlorophyll_concentration":3.15,"salinity":34.92,"nutrient_level":2.17,"oxygen_concentration":6.78},
            {"timestamp":"2025-01-02T09:00:00","significant_wave_height":1.36,"max_wave_height":2.58,"mean_wave_period":7.17,"peak_wave_period":8.49,"sea_surface_temp":27.91,"chlorophyll_concentration":2.89,"salinity":35.23,"nutrient_level":2.33,"oxygen_concentration":6.98},
            {"timestamp":"2025-01-02T10:00:00","significant_wave_height":1.23,"max_wave_height":2.67,"mean_wave_period":7.04,"peak_wave_period":8.57,"sea_surface_temp":27.95,"chlorophyll_concentration":2.87,"salinity":34.73,"nutrient_level":2.09,"oxygen_concentration":6.79},
            {"timestamp":"2025-01-02T11:00:00","significant_wave_height":1.12,"max_wave_height":2.36,"mean_wave_period":6.76,"peak_wave_period":8.43,"sea_surface_temp":28.00,"chlorophyll_concentration":3.24,"salinity":35.03,"nutrient_level":2.13,"oxygen_concentration":6.93},
            {"timestamp":"2025-01-02T12:00:00","significant_wave_height":1.23,"max_wave_height":2.54,"mean_wave_period":7.18,"peak_wave_period":8.42,"sea_surface_temp":28.02,"chlorophyll_concentration":3.03,"salinity":35.20,"nutrient_level":2.04,"oxygen_concentration":6.77},
            {"timestamp":"2025-01-02T13:00:00","significant_wave_height":1.28,"max_wave_height":2.51,"mean_wave_period":7.22,"peak_wave_period":8.68,"sea_surface_temp":27.98,"chlorophyll_concentration":3.11,"salinity":34.85,"nutrient_level":2.38,"oxygen_concentration":6.91},
            {"timestamp":"2025-01-02T14:00:00","significant_wave_height":1.20,"max_wave_height":2.39,"mean_wave_period":6.90,"peak_wave_period":8.38,"sea_surface_temp":28.37,"chlorophyll_concentration":2.97,"salinity":35.17,"nutrient_level":2.31,"oxygen_concentration":6.60},
            {"timestamp":"2025-01-02T15:00:00","significant_wave_height":1.35,"max_wave_height":2.47,"mean_wave_period":7.30,"peak_wave_period":8.50,"sea_surface_temp":28.40,"chlorophyll_concentration":3.18,"salinity":34.91,"nutrient_level":2.28,"oxygen_concentration":6.90},
            {"timestamp":"2025-01-02T16:00:00","significant_wave_height":1.19,"max_wave_height":2.32,"mean_wave_period":7.25,"peak_wave_period":8.32,"sea_surface_temp":28.11,"chlorophyll_concentration":2.92,"salinity":35.09,"nutrient_level":2.36,"oxygen_concentration":7.09},
            {"timestamp":"2025-01-02T17:00:00","significant_wave_height":1.27,"max_wave_height":2.45,"mean_wave_period":7.19,"peak_wave_period":8.44,"sea_surface_temp":27.98,"chlorophyll_concentration":3.09,"salinity":35.33,"nutrient_level":2.12,"oxygen_concentration":6.95},
            {"timestamp":"2025-01-02T18:00:00","significant_wave_height":1.23,"max_wave_height":2.35,"mean_wave_period":7.12,"peak_wave_period":8.65,"sea_surface_temp":27.75,"chlorophyll_concentration":3.27,"salinity":34.97,"nutrient_level":2.17,"oxygen_concentration":6.90},
            {"timestamp":"2025-01-02T19:00:00","significant_wave_height":1.30,"max_wave_height":2.59,"mean_wave_period":7.22,"peak_wave_period":8.53,"sea_surface_temp":27.89,"chlorophyll_concentration":2.91,"salinity":34.93,"nutrient_level":2.29,"oxygen_concentration":6.67},
            {"timestamp":"2025-01-02T20:00:00","significant_wave_height":1.18,"max_wave_height":2.50,"mean_wave_period":7.05,"peak_wave_period":8.15,"sea_surface_temp":28.32,"chlorophyll_concentration":3.11,"salinity":35.24,"nutrient_level":2.25,"oxygen_concentration":6.87},
            {"timestamp":"2025-01-02T21:00:00","significant_wave_height":1.12,"max_wave_height":2.34,"mean_wave_period":7.04,"peak_wave_period":8.24,"sea_surface_temp":28.10,"chlorophyll_concentration":3.16,"salinity":35.05,"nutrient_level":2.16,"oxygen_concentration":6.94},
            {"timestamp":"2025-01-02T22:00:00","significant_wave_height":1.16,"max_wave_height":2.51,"mean_wave_period":7.17,"peak_wave_period":8.55,"sea_surface_temp":27.83,"chlorophyll_concentration":3.22,"salinity":34.96,"nutrient_level":2.32,"oxygen_concentration":6.84},
            {"timestamp":"2025-01-02T23:00:00","significant_wave_height":1.29,"max_wave_height":2.48,"mean_wave_period":7.16,"peak_wave_period":8.42,"sea_surface_temp":28.13,"chlorophyll_concentration":2.88,"salinity":35.02,"nutrient_level":2.27,"oxygen_concentration":6.98}
        ]

        // 🎲 Pick random algae dataset
        const randomAlgae = algaeSamples[Math.floor(Math.random() * algaeSamples.length)];

        // Raw bleaching values
        const bleachingRaw = {
          sea_surface_temp: randomAlgae?.sea_surface_temp ?? 0,
          ph_level: 8.05,
          bleaching_severity: "Medium",
          species_observed: 34,
          marine_heatwave: true,
          chlorophyll: 0.6,
          salinity: 35.1,
          turbidity: 0.7,
          oxygen_level: 6.8,
          nutrient_index: 0.9,
          wave_height: randomAlgae?.significant_wave_height ?? 0,
          current_speed: 0.4
        };

        const bleachingFeatures = [
          bleachingRaw.sea_surface_temp,
          bleachingRaw.ph_level,
          bleachingRaw.bleaching_severity === "High" ? 1 : bleachingRaw.bleaching_severity === "Medium" ? 0.5 : 0,
          bleachingRaw.species_observed,
          bleachingRaw.marine_heatwave ? 1 : 0,
          bleachingRaw.chlorophyll,
          bleachingRaw.salinity,
          bleachingRaw.turbidity,
          bleachingRaw.oxygen_level,
          bleachingRaw.nutrient_index,
          bleachingRaw.wave_height,
          bleachingRaw.current_speed,
          bleachingRaw.nitrate_concentration ?? 0.05,
          bleachingRaw.phosphate_concentration ?? 0.02,
          bleachingRaw.light_penetration ?? 0.9,
          bleachingRaw.upwelling_index ?? 0.05
        ];

        const finalData = {
          hurricane: {
            wind_speed: h1?.current?.wind_speed_10m ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            humidity: h1?.current?.relative_humidity_2m ?? null,
            wind_direction: h1?.current?.wind_direction_10m ?? null,
            wave_height: h2?.current?.wave_height ?? null,
            sea_surface_temp: h2?.current?.sea_surface_temperature ?? null,
            cloud_cover: h3?.current?.cloud_cover ?? null,
            precipitation: h3?.current?.precipitation ?? null,
          },
          tsunami: tsunamiData?.features?.[0]
            ? {
                magnitude: tsunamiData.features[0].properties.mag ?? null,
                latitude: tsunamiData.features[0].geometry?.coordinates?.[1] ?? null,
                longitude: tsunamiData.features[0].geometry?.coordinates?.[0] ?? null,
                depth: tsunamiData.features[0].geometry?.coordinates?.[2] ?? null,
              }
            : null,
          algae: randomAlgae, // 🎲 Use random sample here
          bleaching: {
            features: bleachingFeatures
          }
        };

        setData(finalData);
        onData?.(finalData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    if (latitude && longitude) {
      fetchData();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    console.log("Combined Data:", data);
  }, [data]);

  return null; // just a fetcher
}