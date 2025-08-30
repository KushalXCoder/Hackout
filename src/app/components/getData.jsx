"use client";

import { useEffect, useState } from "react";

export default function CombinedData({ latitude, longitude }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Dynamic dates
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 5);

        const endDateStr = endDate.toISOString().split("T")[0];
        const startDateStr = startDate.toISOString().split("T")[0];

        console.log(endDateStr);
        console.log(startDateStr);

        // API endpoints with dynamic lat/long + dates
        const urls = {
          hurricane1: `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=wind_speed_10m,relative_humidity_2m,wind_direction_10m&timezone=Asia%2FBangkok`,
          hurricane2: `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&current=wave_height,sea_surface_temperature&timezone=Asia%2FSingapore&forecast_days=1`,
          hurricane3: `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=precipitation,cloud_cover&timezone=Asia%2FSingapore&forecast_days=1`,
          algae: `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&current=wave_height,wave_period,sea_surface_temperature&timezone=Asia%2FBangkok`,
          tsunami: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDateStr}&endtime=${endDateStr}&minmagnitude=7`
        };

        // Fetch all in parallel
        const responses = await Promise.all(Object.values(urls).map(u => fetch(u)));
        const results = await Promise.all(responses.map(r => r.json()));

        const [h1, h2, h3, algaeData, tsunamiData] = results;

        console.log(tsunamiData);

        // Final structured data
        const finalData = {
          hurricane: {
            wind_speed: h1?.current?.wind_speed_10m ?? null,
            pressure: null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            storm_category: null, // (optional: can calculate from wind_speed)
            humidity: h1?.current?.relative_humidity_2m ?? null,
            wind_direction: h1?.current?.wind_direction_10m ?? null,
            wave_height: h2?.current?.wave_height ?? null,
            month: endDate.getMonth() + 1,
            day_of_year: Math.ceil((endDate - new Date(endDate.getFullYear(), 0, 0)) / 86400000),
            sea_surface_temp: h2?.current?.sea_surface_temperature ?? null,
            cloud_cover: h3?.current?.cloud_cover ?? null,
            precipitation: h3?.current?.precipitation ?? null,
            storm_radius: null
          },
          tsunami: tsunamiData?.features?.[0]
            ? {
                magnitude: tsunamiData.features[0].properties.mag ?? null,
                cdi: tsunamiData.features[0].properties.cdi ?? null,
                mmi: tsunamiData.features[0].properties.mmi ?? null,
                sig: tsunamiData.features[0].properties.sig ?? null,
                nst: tsunamiData.features[0].properties.nst ?? null,
                dmin: tsunamiData.features[0].properties.dmin ?? null,
                gap: tsunamiData.features[0].properties.gap ?? null,
                depth: tsunamiData.features[0].geometry?.coordinates?.[2] ?? null,
                latitude: tsunamiData.features[0].geometry?.coordinates?.[1] ?? null,
                longitude: tsunamiData.features[0].geometry?.coordinates?.[0] ?? null,
                year: new Date(tsunamiData.features[0].properties.time).getFullYear(),
                month: new Date(tsunamiData.features[0].properties.time).getMonth() + 1,
                mag_type: tsunamiData.features[0].properties.magType ?? null,
              }
            : null,
          algae: {
            significant_wave_height: algaeData?.current?.wave_height ?? null,
            max_wave_height: algaeData?.daily?.wave_height_max?.[0] ?? null,
            mean_wave_period: algaeData?.current?.wave_period ?? null,
            peak_wave_period: algaeData?.daily?.wave_period_max?.[0] ?? null,
            sea_surface_temp: algaeData?.current?.sea_surface_temperature ?? null,
            chlorophyll_concentration: null,
            salinity: null,
            nutrient_level: null,
            oxygen_concentration: null
          },
          bleaching: {
            date: endDate.toISOString().split("T")[0],
            location_name: "Great Barrier Reef",
            latitude: -18.2871,
            longitude: 147.6992,
            sea_surface_temp: algaeData?.current?.sea_surface_temperature ?? null,
            ph_level: null,
            bleaching_severity: null,
            species_observed: null,
            marine_heatwave: null,
            chlorophyll: null,
            salinity: null,
            turbidity: null,
            oxygen_level: null,
            nutrient_index: null,
            wave_height: algaeData?.current?.wave_height ?? null,
            current_speed: null
          }
        };

        setData(finalData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    if (latitude && longitude) {
      fetchData();
    }
  }, [latitude, longitude]);

  return (
    <pre className="text-xs bg-black text-green-400 p-4 rounded">
      {data ? JSON.stringify(data, null, 2) : "Loading..."}
    </pre>
  );
}