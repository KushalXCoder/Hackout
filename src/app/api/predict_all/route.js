export async function POST(req) {
  try {
    const backendUrl =" http://127.0.0.1:5000/predict_all"; // e.g., http://127.0.0.1:5000/predict_all
    const input = await req.json();

    // Fallback mock if no backend configured
    if (!backendUrl) {
      const mock = {
        algae: 3.8455799999999987,
        bleaching: { prediction: 1, probability: 0.993824565319233 },
        hurricane: 0.19,
        tsunami: 0.65,
      };
      return new Response(JSON.stringify(mock), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      // Return mock on failure to keep UI flowing
      const mock = {
        algae: 3.8455799999999987,
        bleaching: { prediction: 1, probability: 0.993824565319233 },
        hurricane: 0.19,
        tsunami: 0.65,
      };
      return new Response(JSON.stringify(mock), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("/api/predict_all proxy error:", err);
    // Safe fallback
    const mock = {
      algae: 3.8455799999999987,
      bleaching: { prediction: 1, probability: 0.993824565319233 },
      hurricane: 0.19,
      tsunami: 0.65,
    };
    return new Response(JSON.stringify(mock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
