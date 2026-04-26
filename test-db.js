import mongoose from "mongoose";

const password = "MUSEART123";
const username = "MONGODB_URI";
const cluster = "mernstackproject.3z8tnog.mongodb.net";
const dbName = "MuseArt";
const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&authSource=admin`;

console.log("Testing connection with:");
console.log(`Username: ${username}`);
console.log(`Cluster: ${cluster}`);
console.log(`URI (Redacted): mongodb+srv://${username}:****@${cluster}/...`);

async function test() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Connection failed.");
    console.error(err.message);
    process.exit(1);
  }
}

test();
