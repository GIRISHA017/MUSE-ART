import mongoose from "mongoose";

const password = "MUSEART123";
const username = "MONGODB_URI";
const cluster = "mernstackproject.3z8tnog.mongodb.net";
const dbName = "MuseArt";

const variations = [
  { name: "Default (No authSource, with DB)", uri: `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority` },
  { name: "With authSource=admin", uri: `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&authSource=admin` },
  { name: "Connecting to admin directly", uri: `mongodb+srv://${username}:${password}@${cluster}/admin?retryWrites=true&w=majority` },
  { name: "No DB path", uri: `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority` }
];

async function runTests() {
  for (const test of variations) {
    console.log(`\n--- Testing: ${test.name} ---`);
    console.log(`URI: ${test.uri.replace(/:[^:@]+@/, ":****@")}`);
    try {
      // Create a fresh connection for each test
      const conn = await mongoose.createConnection(test.uri, { 
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      }).asPromise();
      
      console.log(`✅ SUCCESS: ${test.name}`);
      console.log(`Connected to: ${conn.name}`);
      await conn.close();
      process.exit(0); // Exit if any variation works
    } catch (err) {
      console.error(`❌ FAILED: ${test.name}`);
      console.error(`Error: ${err.message}`);
    }
  }
  console.log("\nAll variations failed.");
  process.exit(1);
}

runTests();
