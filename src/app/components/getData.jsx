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

        // Raw bleaching values
        const bleachingRaw = {
          sea_surface_temp: algaeData?.current?.sea_surface_temperature ?? 0,
          ph_level: 8.05, // fallback/mock
          bleaching_severity: "Medium",
          species_observed: 34,
          marine_heatwave: true,
          chlorophyll: 0.6,
          salinity: 35.1,
          turbidity: 0.7,
          oxygen_level: 6.8,
          nutrient_index: 0.9,
          wave_height: algaeData?.current?.wave_height ?? 0,
          current_speed: 0.4
        };

        // 🚀 Transform into features array
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
  // placeholders filled:
  bleachingRaw.nitrate_concentration ?? 0.05,    // normalized: low nitrate
  bleachingRaw.phosphate_concentration ?? 0.02,  // normalized: low phosphate
  bleachingRaw.light_penetration ?? 0.9,         // normalized: high clarity (deep light)
  bleachingRaw.upwelling_index ?? 0.05           // normalized: weak upwelling
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
          algae: {
            significant_wave_height: algaeData?.current?.wave_height ?? null,
            max_wave_height: algaeData?.daily?.wave_height_max?.[0] ?? null,
            mean_wave_period: algaeData?.current?.wave_period ?? null,
            peak_wave_period: algaeData?.daily?.wave_period_max?.[0] ?? null,
            sea_surface_temp: algaeData?.current?.sea_surface_temperature ?? null,
          },
          bleaching: {
            features: bleachingFeatures
          }
        };

        setData(finalData);
        onData?.(finalData); // 🔥 push data to parent
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    if (latitude && longitude) {
      fetchData();
    }
  }, [latitude, longitude]);

  return null; // just a fetcher
}
