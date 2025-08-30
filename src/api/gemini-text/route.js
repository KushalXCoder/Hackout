// app/api/gemini-text/route.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.geminiKey // Your Gemini API key
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { predictions } = body;

    if (!predictions) {
      return new Response(JSON.stringify({ alerts: [] }), { status: 400 });
    }

    // Prompt Gemini to generate alerts from predictions
    const prompt = `
You are an environmental alert system.
Based on the following prediction data, generate an array of alert objects.
Each alert should have:
- type: short descriptive name
- location: relevant location
- description: short description in plain English
- status: "danger" or "safe" depending on severity

Predictions JSON:
${JSON.stringify(predictions)}

Respond ONLY with valid JSON array named "alerts".
`;

    const response = await client.chat.completions.create({
      model: "gemini-1.5", // Gemini model
      messages: [
        { role: "system", content: "You are a helpful assistant that converts prediction data to alerts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;

    let alerts = [];
    try {
      const jsonMatch = content.match(/\{.*\}/s) || content.match(/\[.*\]/s);
      if (jsonMatch) {
        alerts = JSON.parse(jsonMatch[0]).alerts || [];
      }
    } catch (err) {
      console.error("Error parsing Gemini JSON:", err);
    }

    return new Response(JSON.stringify({ alerts }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Gemini API error:", err);
    return new Response(JSON.stringify({ alerts: [], error: err.message }), { status: 500 });
  }
}
