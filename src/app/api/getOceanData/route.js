import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Support multiple environment variable names for convenience
const apiKey =
    process.env.MOCK_GEMINI_API_KEY


const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req) {
    console.log(apiKey);
    if (!genAI) {
        return NextResponse.json(
            { error: "Gemini API key missing. Set geminiKey or GEMINI_API_KEY or GOOGLE_API_KEY." },
            { status: 500 }
        );
    }
    try {
        const { longitude, latitude } = await req.json();

        const lon = Number(longitude);
        const lat = Number(latitude);
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
            return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
        }

        const prompt = `
You are an AI system that provides oceanographic and environmental data for a given location.
I will provide you a pair of coordinates: longitude: ${lon}, latitude: ${lat}.

Your task is to return a JSON object with the following structure:

{
  "isOcean": boolean,
  "sea_level_m": number,
  "tide_m": number,
  "wind_speed_mps": number,
  "air_pressure_hPa": number,
  "sea_surface_temp_C": number,
  "chlorophyll_mg_m3": number,
  "cyclone_activity_index": number,
  "erosion_rate_cm_month": number,
  "wave_energy_kJ": number,
  "storm_surge_index": number,
  "tide_height_m": number,
  "sea_level_cm": number,
  "wave_height_m": number,
  "wind_speed_kmph": number,
  "rainfall_mm": number,
  "pressure_hPa": number,
  "temperature_C": number,
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
  "turbidity_NTU": number,
  "chlorophyll_ugL": number,
  "pH": number,
  "anomaly_label": string
}

Rules:
1. If the coordinates are in an ocean, return "isOcean": true and plausible values for all other fields.
2. If the coordinates are on land, return "isOcean": false and other fields as null.
3. Values do not need to be real-time accurate but should be plausible.
4. Respond strictly in valid JSON format only. Do not include any backticks.
`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result?.response?.text?.() ?? "";

        // Extract the JSON portion (handles cases where the model adds prose or fences)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;

        const data = JSON.parse(jsonString);
        return NextResponse.json(data);
    } catch (error) {
        console.error("getOceanData API error:", error);
        return NextResponse.json({ error: "Failed to fetch ocean data" }, { status: 500 });
    }
}
