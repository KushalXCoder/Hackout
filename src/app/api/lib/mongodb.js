import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("Please add MONGO_URI to your environment variables");
}

const client = new MongoClient(process.env.MONGO_URI);
const clientPromise = client.connect();

export default clientPromise;
