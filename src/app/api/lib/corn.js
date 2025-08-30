// src/lib/cron.js
import cron from "node-cron";
import fetch from "node-fetch";

export function startHourlyUpdates() {
  cron.schedule("0 * * * *", async () => {
    console.log("Running hourly updates...");
    try {
      await fetch("http://localhost:3000/api/hourly-updates");
    } catch (err) {
      console.error("Hourly update failed:", err);
    }
  });
}
    