import clientPromise from "../lib/mongodb";
import Subscriber from "../models/subscriber.model";
export const POST = async (req) => {
  const { email, latitude, longitude } = await req.json();
  const db = (await clientPromise).db("coastal-dashboard");

  const existing = await db.collection("subscribers").findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
  }

  const newSubscriber = {
    ...Subscriber,
    email,
    location: { lat: latitude, lon: longitude },
    createdAt: new Date()
  };

  await db.collection("subscribers").insertOne(newSubscriber);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
