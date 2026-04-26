import { MongoClient } from "mongodb";

const password = "MUSEART123";
const username = "MONGODB_URI";
const cluster = "mernstackproject.3z8tnog.mongodb.net";
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;

async function testNative() {
  const client = new MongoClient(uri);
  console.log("Testing with native MongoDB driver...");
  try {
    await client.connect();
    console.log("✅ SUCCESS: Native driver connected!");
    await client.db("admin").command({ ping: 1 });
    console.log("Ping successful.");
    await client.close();
  } catch (err) {
    console.error("❌ FAILED: Native driver connection failed.");
    console.error(err.message);
  }
}

testNative();
