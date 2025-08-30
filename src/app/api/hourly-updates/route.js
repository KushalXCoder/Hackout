// src/app/api/hourly-updates/route.js
import clientPromise from "../lib/mongodb";
export const runtime = "nodejs";
/**
 * Send an email using Brevo (via REST API)
 * @param {string|string[]} to - Recipient(s) email address
 * @param {string} subject - Email subject
 * @param {string} message - HTML body
 * @returns {Promise<object>} - Brevo API response
 */
export async function sendMail(to, subject, message) {
  try {
    if (!process.env.brevoKey || !process.env.brevoMail) {
      throw new Error("Missing brevoKey or brevoMail in environment");
    }
    
    const payload = {
      sender: { email: process.env.brevoMail },
      to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
      subject,
      htmlContent: message,
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.brevoKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Brevo API error");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message || error };
  }
}

import Subscriber from "../models/subscriber.model";
// Fetch predictions from Python API
async function fetchPrediction(lat, lon) {
  const res = await fetch("http://127.0.0.1:5000/predict_all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude: lat, longitude: lon }),
  });
  if (!res.ok) throw new Error("Prediction API failed");
  return res.json();
}

// Fetch Gemini alerts
async function fetchGeminiText(predictions) {
  const res = await fetch("http://localhost:3000/api/gemini-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ predictions }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.alerts || [];
}
export const GET = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("coastal-dashboard");

    const subscribers = await db.collection("subscribers").find().toArray();

    for (const user of subscribers) {
      const { email, location } = user;

      let predictions = {};
      let alerts = [];

      try {
        predictions = await fetchPrediction(location.lat, location.lon);
        alerts = await fetchGeminiText(predictions);
      } catch (err) {
        console.warn(`Skipping subscriber ${email} due to API error:`, err);
      }

      const alertHtml = alerts
        .map(
          (a) => `
          <li>
            <b>${a.type}</b> - ${a.status}<br/>
            ${a.description || ""}
          </li>
        `
        )
        .join("");

      const message = `
        <p>Hourly Coastal Update for your location:</p>
        <ul>
          <li>Algae: ${predictions.algae ?? "N/A"}</li>
          <li>Bleaching: ${predictions.bleaching?.prediction ?? "N/A"}</li>
          <li>Hurricane risk: ${predictions.hurricane ?? "N/A"}</li>
          <li>Tsunami risk: ${predictions.tsunami ?? "N/A"}</li>
          ${alertHtml}
        </ul>
      `;

      await sendMail(email, "🌊 Coastal Update", message);
    }

    return new Response(JSON.stringify({ success: true, sent: subscribers.length }), { status: 200 });
  } catch (err) {
    console.error("Hourly update error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
