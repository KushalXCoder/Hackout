This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Coastal Early Warning Dashboard

A Next.js 15 + React 19 app that visualizes coastal conditions and generates real-time safety alerts using external data sources, a Python ML service, and Gemini-generated summaries.

## Features

- __Interactive map__: `src/app/components/map.jsx` (Leaflet + Windy embeds), nearest cyclone overlay via XWeather API.
- __Sensor charts__: Wind, tide, temperature, rainfall via Open-Meteo APIs (`windspeed.jsx`, `tidelevel.jsx`, `watertemp.jsx`, `rainfall.jsx`).
- __Data aggregator__: `src/app/components/getData.jsx` fetches multiple sources and emits a combined payload to drive predictions.
- __ML predictions__: Frontend posts to Python service at `http://127.0.0.1:5000/predict_all` and falls back to mock data if unavailable.
- __Alert generation__: `/api/gemini-text` uses Google Gemini to turn predictions into readable alerts with a robust JSON fallback.
- __Email + SMS__: Hourly email summaries to subscribers and on-demand SMS via Twilio.
- __Hourly job__: `node-cron` triggers `/api/hourly-updates` to email subscribers.

## Tech Stack

- Next.js 15, React 19, Tailwind CSS v4
- Leaflet + react-leaflet, Recharts
- MongoDB (native driver)
- node-cron
- Twilio, Brevo (email), Google Generative AI (Gemini)

## Environment Variables

Create a `.env.local` in the project root with:

```bash
# MongoDB
MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

# Gemini
geminiKey="<google_generative_ai_api_key>"

# Email (Brevo)
brevoKey="<brevo_api_key>"
brevoMail="no-reply@yourdomain.com"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="<sid>"
TWILIO_AUTH_TOKEN="<auth_token>"
TWILIO_PHONE_NUMBER="+1234567890"

# XWeather (Cyclone overlay in map.jsx)
API_ID="<xweather_client_id>"
API_SECRET="<xweather_client_secret>"
```

- Mongo client is initialized in `src/app/api/lib/mongodb.js` and throws if `MONGO_URI` is missing.
- Gemini key is read in `src/app/api/gemini-text/route.js`.
- Twilio keys are read in `src/app/api/send-sms/route.js`.
- Brevo keys are used in `src/app/api/hourly-updates/route.js` (and `src/app/utils/mailer.utils.js` if you reuse it).
- XWeather keys are read client-side in `src/app/components/map.jsx` for cyclone fetches.

## API Endpoints

- __POST__ `./api/register` — body: `{ email, latitude, longitude }`
  - Persists to `coastal-dashboard.subscribers` via `MONGO_URI`.
- __GET__ `./api/hourly-updates` — iterates subscribers, fetches predictions and Gemini alerts, and emails HTML summary.
- __POST__ `./api/gemini-text` — body: `{ predictions }` — returns `{ alerts: [...] }` with safe fallbacks when key is missing.
- __POST__ `./api/send-sms` — body: `{ to, message }` — sends SMS via Twilio.
- __POST__ `./api/predict_all` — proxy to Python `http://127.0.0.1:5000/predict_all` with UI-safe fallbacks on error.

## Python Prediction Service

The dashboard expects a Python backend at `http://127.0.0.1:5000/predict_all` accepting a JSON body shaped like `CombinedData` from `getData.jsx` and returning:

```json
{
  "algae": number,
  "bleaching": { "prediction": number, "probability": number },
  "hurricane": number,
  "tsunami": number
}
```

If unavailable, the UI and proxy return mock data so the app remains functional.

## Running Locally

1) __Install deps__
```bash
npm install
```

2) __Configure env__ — create `.env.local` with the variables above.

3) __Run the Next.js app__
```bash
npm run dev
# http://localhost:3000
```

4) __Run the Python service__ (separately) on `http://127.0.0.1:5000`.

5) __Optional__: Seed a subscriber by calling `POST /api/register` with `{ email, latitude, longitude }`.

## Background Job

- `startHourlyUpdates()` is imported in `src/app/layout.js` from `src/app/api/lib/corn.js` and schedules an hourly GET to `/api/hourly-updates` using `node-cron`.
- Ensure the Next.js server process stays running for cron to execute.

## Notes & Caveats

- For client-side use of external keys (e.g., XWeather in `map.jsx`), prefer proxying via Next.js API routes if you need to keep secrets server-side.
- Leaflet components are dynamically imported to avoid SSR issues.
- The app uses graceful fallbacks for unstable external services to keep the UI responsive.
