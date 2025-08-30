import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.geminiKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const { predictions } = body;

    if (!predictions) {
      return new Response(JSON.stringify({ alerts: [] }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt Gemini to generate alerts from predictions
    const prompt = `
You are an environmental alert system that analyzes coastal prediction data.
Based on the following prediction data, generate alerts for potential hazards.

Prediction Data:
${JSON.stringify(predictions, null, 2)}

Generate alerts based on these criteria:
- Hurricane: If wind_speed > 74 mph or storm_category >= 1
- Tsunami: If magnitude >= 6.0 or significant wave indicators
- Algae Bloom: If chlorophyll_concentration > 2.0 or nutrient_level > 1.5
- Coral Bleaching: If sea_surface_temp > 28°C or bleaching_severity is not "Low"

Respond with ONLY a valid JSON object in this exact format:
{
  "alerts": [
    {
      "type": "Alert Type",
      "location": "Location Name", 
      "description": "Brief description of the hazard",
      "status": "danger"
    }
  ]
}

Use "danger" for severe threats and "safe" for low-risk conditions.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    let alerts = [];
    try {
      // Try to parse the JSON response
      const cleanContent = content.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(cleanContent);
      
      if (parsedData.alerts && Array.isArray(parsedData.alerts)) {
        alerts = parsedData.alerts;
      } else if (Array.isArray(parsedData)) {
        // In case the response is directly an array
        alerts = parsedData;
      }
    } catch (parseErr) {
      console.error("Error parsing Gemini JSON response:", parseErr);
      console.log("Raw Gemini response:", content);
      
      // Fallback: create alerts based on prediction data directly
      alerts = generateFallbackAlerts(predictions);
    }

    return new Response(JSON.stringify({ alerts }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Gemini API error:", err);
    
    // Return fallback alerts when API fails
    const fallbackAlerts = generateFallbackAlerts(body?.predictions || {});
    
    return new Response(JSON.stringify({ 
      alerts: fallbackAlerts,
      error: "API temporarily unavailable, showing generated alerts"
    }), { 
      status: 200, // Return 200 so frontend doesn't treat as error
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Fallback function to generate alerts from prediction data
function generateFallbackAlerts(predictions) {
  const alerts = [];

  if (predictions.hurricane) {
    const { wind_speed, storm_category, latitude, longitude } = predictions.hurricane;
    if (wind_speed >= 74 || storm_category >= 1) {
      alerts.push({
        type: "Hurricane Warning",
        location: `${latitude.toFixed(1)}°N, ${Math.abs(longitude).toFixed(1)}°W`,
        description: `Category ${storm_category} hurricane with ${wind_speed} mph winds approaching`,
        status: "danger"
      });
    }
  }

  if (predictions.tsunami) {
    const { magnitude, latitude, longitude } = predictions.tsunami;
    if (magnitude >= 6.0) {
      alerts.push({
        type: "Tsunami Alert",
        location: `${Math.abs(latitude).toFixed(1)}°S, ${longitude.toFixed(1)}°E`,
        description: `Magnitude ${magnitude} earthquake detected, tsunami waves possible`,
        status: "danger"
      });
    }
  }

  if (predictions.algae) {
    const { chlorophyll_concentration, sea_surface_temp } = predictions.algae;
    if (chlorophyll_concentration > 2.0) {
      alerts.push({
        type: "Algae Bloom",
        location: "Coastal Waters",
        description: `Harmful algae bloom detected with chlorophyll at ${chlorophyll_concentration} mg/m³`,
        status: "danger"
      });
    }
  }

  if (predictions.bleaching) {
    const { location_name, sea_surface_temp, bleaching_severity } = predictions.bleaching;
    if (sea_surface_temp > 28 || bleaching_severity !== "Low") {
      alerts.push({
        type: "Coral Bleaching",
        location: location_name || "Coral Reef Area",
        description: `${bleaching_severity} bleaching severity detected, water temp ${sea_surface_temp}°C`,
        status: bleaching_severity === "High" ? "danger" : "safe"
      });
    }
  }

  // If no specific alerts, add a general status
  if (alerts.length === 0) {
    alerts.push({
      type: "All Clear",
      location: "Monitoring Area",
      description: "No immediate coastal hazards detected",
      status: "safe"
    });
  }

  return alerts;
}